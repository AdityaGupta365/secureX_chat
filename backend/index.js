// index.js
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import { createServer } from 'http';
// import User from './features/users/users.schema.js';
// import userRouter from './features/users/users.routes.js';
// import messageRouter from './features/message/message.router.js';
// import chatRouter from './features/chat/chat.routes.js';
// import auth from './middlewares/auth_middleware.js';
// import auth_middleware from './middlewares/auth_middleware.js';
// dotenv.config();

// const app = express();
// const server = createServer(app);

// // Initialize socket.io
// const { Server } = await import('socket.io');
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST']
//   }
// });

// // Middleware
// app.use(cors());
// app.use(express.json()); // important for parsing JSON requests
// app.use('/api/auth',userRouter);
// app.use('/api/messages',auth,messageRouter);
// app.use('/api/chats',auth,chatRouter);

// // MongoDB connection (✅ cleaned up)
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat')
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Optional: Setup socket.io handlers
// io.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);

//   socket.on('join', (userData) => {
//     socket.userId = userData.userId;
//     socket.join(userData.userId);
    
//     // Update user online status
//     User.findByIdAndUpdate(userData.userId, { 
//       isOnline: true 
//     }).exec();
//   });
//   socket.on('join-chat', (chatId) => {
//     socket.join(chatId);
//   });



//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//     if(socket.userId){
//       User.findByIdAndUpdate(socket.userId,{
//         isOnline:false,
//         lastSeen:new Date()
//       }).exec();
//     }
//     console.log('User disconnected:',socket.id);

//   });

//   // Example: handle messages
//   socket.on('new-message', (data) => {
//     console.log('Message received:', data);
//     socket.broadcast.emit('message', data);
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });








// server.js
// --------------------------------------------------
// Main entry point for the Chat App backend
// – Express + MongoDB + Socket.IO
// --------------------------------------------------

// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import { createServer } from 'http';
// import { Server as SocketIOServer } from 'socket.io';

// import userRouter from './features/users/users.routes.js';
// import messageRouter from './features/message/message.router.js';
// import chatRouter from './features/chat/chat.routes.js';
// import auth from './middlewares/auth_middleware.js';
// import User from './features/users/users.schema.js';
// import getLogs from './packetLogs.js';

// // import Message from './features/message/message.schema.js'  // if you want to persist messages

// dotenv.config();                   // loads .env

// /* -------------------------------------------------- */
// /*  Express + HTTP server                             */
// /* -------------------------------------------------- */
// const app = express();
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true,
// }));
// app.use(express.json());           // parses application/json

// /* -------------------------------------------------- */
// /*  REST routes                                       */
// /* -------------------------------------------------- */
// app.use('/api/auth',  userRouter);                      // public
// app.use('/api/messages', auth, messageRouter);          // protected
// app.use('/api/chats',    auth, chatRouter); 
//             // protected
// app.get('/get-logs',getLogs);

// /* -------------------------------------------------- */
// /*  DB connection                                     */
// /* -------------------------------------------------- */
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat')
//   .then(() => console.log('✅  MongoDB connected'))
//   .catch((err) => {
//     console.error('❌  MongoDB connection error:', err);
//     process.exit(1);
//   });

// /* -------------------------------------------------- */
// /*  Socket.IO                                         */
// /* -------------------------------------------------- */
// const httpServer = createServer(app);
// const io = new SocketIOServer(httpServer, {
//   cors: {
//     origin: process.env.CLIENT_URL || 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   },
// });

// io.on('connection', (socket) => {
//   console.log('🔌  Client connected:', socket.id);

//   /* ----------- JOIN USER’S PERSONAL ROOM ---------- */
//   socket.on('join', async ({ userId }) => {
//     try {
//       socket.userId = userId;        // save for later
//       socket.join(userId);           // personal room
//       await User.findByIdAndUpdate(userId, { isOnline: true });
//       console.log(`👤 User ${userId} is online`);
//     } catch (err) {
//       console.error('join error:', err);
//     }
//   });

//   /* --------------- JOIN A CHAT ROOM --------------- */
//   socket.on('join-chat', (chatId) => {
//     socket.join(chatId);
//     console.log(`💬 ${socket.userId ?? 'Someone'} joined chat ${chatId}`);
//   });

//   /* ----------------- NEW MESSAGE ------------------ */
//   socket.on('new-message', async (msg) => {
//     try {
//       // Optionally persist in DB
//       // const saved = await Message.create(msg);
//       io.to(msg.chatId).emit('message-received', msg);  // everyone incl. sender
//       console.log('✉️  Message broadcast:', msg);
//     } catch (err) {
//       console.error('new‑message error:', err);
//       socket.emit('message-error', { error: 'Failed to send message' });
//     }
//   });

//   /* -------------- TYPING INDICATORS --------------- */
//   socket.on('typing',   ({ chatId }) => socket.to(chatId).emit('user-typing',   { userId: socket.userId, isTyping: true  }));
//   socket.on('stop-typing', ({ chatId }) => socket.to(chatId).emit('user-typing', { userId: socket.userId, isTyping: false }));

//   /* ---------------- DISCONNECT -------------------- */
//   socket.on('disconnect', async () => {
//     console.log('🔌  Client disconnected:', socket.id);
//     if (socket.userId) {
//       try {
//         await User.findByIdAndUpdate(socket.userId, {
//           isOnline: false,
//           lastSeen: new Date(),
//         });
//         console.log(`👤 User ${socket.userId} went offline`);
//       } catch (err) {
//         console.error('disconnect error:', err);
//       }
//     }
//   });
// });

// /* -------------------------------------------------- */
// /*  Start server                                      */
// /* -------------------------------------------------- */
// const PORT = process.env.PORT || 5000;
// httpServer.listen(PORT, () => {
//   console.log(`🚀  Server running on port ${PORT}`);
// });

// /* -------------------------------------------------- */
// /*  Optional: graceful error for EADDRINUSE           */
// /* -------------------------------------------------- */
// httpServer.on('error', (err) => {
//   if (err.code === 'EADDRINUSE') {
//     console.error(`❌  Port ${PORT} is already in use. Choose another one.`);
//   } else {
//     console.error('Server error:', err);
//   }
// });




// server.js
// --------------------------------------------------
// Main entry point: Express + MongoDB + Socket.IO
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

/* -------------------------------------------------- */
/*  Express + HTTP server                             */
/* -------------------------------------------------- */
const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

/* -------------------------------------------------- */
/*  REST routes                                       */
/* -------------------------------------------------- */
app.use('/api/auth',    userRouter);            // public
app.use('/api/messages', auth, messageRouter);  // protected
app.use('/api/chats',    auth, chatRouter);     // protected
app.get('/get-logs', getLogs);                  // public (change if needed)

/* -------------------------------------------------- */
/*  MongoDB                                           */
/* -------------------------------------------------- */
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat')
  .then(() => console.log('✅  MongoDB connected'))
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  });

/* -------------------------------------------------- */
/*  Socket.IO                                         */
/* -------------------------------------------------- */
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
      io.to(msg.chatId).emit('message-received', msg); // broadcast to room
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
    console.log('🔌  Client disconnected:', socket.id);
    if (socket.userId) {
      await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() });
      console.log(`👤  ${socket.userId} went offline`);
    }
  });
});

/* -------------------------------------------------- */
/*  Boot                                              */
/* -------------------------------------------------- */
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
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









// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import { createServer } from 'http';
// import User from './features/users/users.schema.js';
// import userRouter from './features/users/users.routes.js';
// import messageRouter from './features/message/message.router.js';
// import chatRouter from './features/chat/chat.routes.js';
// import auth from './middlewares/auth_middleware.js';

// dotenv.config();

// const app = express();
// const server = createServer(app);

// // Initialize socket.io
// const { Server } = await import('socket.io');
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || 'http://localhost:3000',
//     methods: ['GET', 'POST']
//   }
// });

// // Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json());

// // Routes
// app.use('/api/auth', userRouter);
// app.use('/api/messages', auth, messageRouter);
// app.use('/api/chats', auth, chatRouter);

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat')
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Socket.IO handlers
// io.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);

//   // User joins their personal room
//   socket.on('join', async (userData) => {
//     try {
//       socket.userId = userData.userId;
//       socket.join(userData.userId);
      
//       // Update user online status
//       await User.findByIdAndUpdate(userData.userId, {
//         isOnline: true,
//         lastSeen: new Date()
//       });
      
//       console.log(`User ${userData.userId} joined their room`);
//     } catch (error) {
//       console.error('Error in join handler:', error);
//     }
//   });

//   // User joins a specific chat room
//   socket.on('join-chat', (chatId) => {
//     socket.join(chatId);
//     console.log(`User ${socket.userId} joined chat ${chatId}`);
//   });

//   // Handle new messages
//   socket.on('new-message', async (messageData) => {
//     try {
//       // Here you would typically save the message to database
//       // and then emit to all users in the chat
      
//       // Emit to all users in the chat room
//       socket.to(messageData.chatId).emit('message-received', messageData);
      
//       // Also emit back to sender for confirmation
//       socket.emit('message-sent', messageData);
      
//       console.log('Message sent:', messageData);
//     } catch (error) {
//       console.error('Error handling new message:', error);
//       socket.emit('message-error', { error: 'Failed to send message' });
//     }
//   });

//   // Handle typing indicators
//   socket.on('typing', (data) => {
//     socket.to(data.chatId).emit('user-typing', {
//       userId: socket.userId,
//       isTyping: true
//     });
//   });

//   socket.on('stop-typing', (data) => {
//     socket.to(data.chatId).emit('user-typing', {
//       userId: socket.userId,
//       isTyping: false
//     });
//   });

//   // Handle disconnection
//   socket.on('disconnect', async () => {
//     console.log('Client disconnected:', socket.id);
    
//     if (socket.userId) {
//       try {
//         await User.findByIdAndUpdate(socket.userId, {
//           isOnline: false,
//           lastSeen: new Date()
//         });
//         console.log(`User ${socket.userId} went offline`);
//       } catch (error) {
//         console.error('Error updating user offline status:', error);
//       }
//     }
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });