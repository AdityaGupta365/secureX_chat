// --------------------------------------------------

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import userRouter    from './features/users/users.routes.js';
import messageRouter from './features/message/message.router.js';
import chatRouter    from './features/chat/chat.routes.js';
import auth          from './middlewares/auth_middleware.js';
import User          from './features/users/users.schema.js';

import getLogs       from './packetLogs.js';

dotenv.config();


const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());


app.use('/api/auth',    userRouter);            
app.use('/api/messages', auth, messageRouter);  
app.use('/api/chats',    auth, chatRouter);     
app.get('/get-logs', getLogs);                  


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat')
  .then(() => console.log('✅  MongoDB connected'))
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  });


const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('🔌  Client connected:', socket.id);

  // join personal room
  socket.on('join', async ({ userId }) => {
    try {
      socket.userId = userId;
      socket.join(userId);
      await User.findByIdAndUpdate(userId, { isOnline: true });
      console.log(`👤  ${userId} is online`);
    } catch (err) {
      console.error('join error:', err);
    }
  });
  
  // join a chat room
  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`💬  ${socket.userId} joined chat ${chatId}`);
  });

  // new message
  socket.on('new-message', async (msg) => {
    try {
      // await Message.create(msg)  // if you store messages
      io.to(msg.chatId).emit('message-received', msg); 
      console.log('✉️  ', msg);
    } catch (err) {
      console.error('new‑message error:', err);
      socket.emit('message-error', { error: 'Failed to send message' });
    }
  });

  // typing indicators
  socket.on('typing',     ({ chatId }) => socket.to(chatId).emit('user-typing',   { userId: socket.userId, isTyping: true  }));
  socket.on('stop-typing',({ chatId }) => socket.to(chatId).emit('user-typing',   { userId: socket.userId, isTyping: false }));

  // disconnect
  socket.on('disconnect', async () => {
    console.log('  Client disconnected:', socket.id);
    if (socket.userId) {
      await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() });
      console.log(` ${socket.userId} went offline`);
    }
  });
});

/* -------------------------------------------------- */
/*  Boot                                              */
/* -------------------------------------------------- */
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`  Server running on http://localhost:${PORT}`);
});

/* -------------------------------------------------- */
/*  Graceful listen errors                            */
/* -------------------------------------------------- */
httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌  Port ${PORT} is already in use.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});









