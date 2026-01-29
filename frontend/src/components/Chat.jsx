


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { logout } from '../redux/slices/authSlice';

import { getChats,createChat,createGroupChat,setSelectedChat } from '../redux/slices/chatSlice';
import { getMessages,addMessage,clearMessages} from '../redux/slices/messageSlice';
import { 
  
  // Rename it here using 'as'
  sendMessage as sendMessageAction 
} from '../redux/slices/messageSlice';
import ChatList from './ChatList';
import MessageArea from './MessageArea';
import UserList from './UserList';
import GroupChatModal from './GroupChatModal';
import { encryptMessage,decryptMessage } from '../utils/encryption.js';
const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedChat } = useSelector((state) => state.chat);

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      // Join user room
      newSocket.emit('join', { userId: user.id });

      // Listen for new messages
      newSocket.on('message-received', (message) => {
        const decryptedContent =decryptMessage(message.content);

        dispatch(addMessage({...message ,content:decryptedContent}));
      });

      // Get user's chats
      dispatch(getChats());

      return () => {
        newSocket.close();
      };
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (selectedChat && socket) {
      socket.emit('join-chat', selectedChat._id);
      dispatch(getMessages(selectedChat._id));
    }
  }, [selectedChat, socket, dispatch]);

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    dispatch(logout());
  };

  const handleUserSelect = (userId) => {
    dispatch(createChat(userId));
    setShowUserList(false);
  };

  const handleGroupCreated = (groupData) => {
    dispatch(createGroupChat(groupData));
    setShowGroupModal(false);
  };

  const sendMessage = async(content) => {
    if (socket && selectedChat) {
      try {
        // Step A: Save to DB via Redux Action (This handles encryption internally)
        const resultAction = await dispatch(sendMessageAction({ 
          content: content, 
          chatId: selectedChat._id 
        }));

        // Step B: If DB save was successful, emit to Socket
        if (sendMessage.fulfilled.match(resultAction)) {
          // 'savedMessage' is the decrypted version for our UI
          const savedMessage = resultAction.payload;

          
          const messageForSocket = {
             ...savedMessage,
             content: encryptMessage(content) // We send ciphertext to the socket
          };

          socket.emit('new-message', messageForSocket);
        }
      } catch (err) {
        console.error("Sending failed", err);
      }
      // const messageData = {
      //   sender: user.id,
      //   content:encryptMessage(content),
      //   chatId: selectedChat._id,
      // };
      // socket.emit('new-message', messageData);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-header">
          <h3>Chat App</h3>
          <div className="header-actions">
            <button onClick={() => setShowUserList(true)}>New Chat</button>
            <button onClick={() => setShowGroupModal(true)}>New Group</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <ChatList />
      </div>
      
      <div className="chat-main">
        {selectedChat ? (
          <MessageArea onSendMessage={sendMessage} />
        ) : (
          <div className="no-chat-selected">
            <h3>Select a chat to start messaging</h3>
          </div>
        )}
      </div>

      {showUserList && (
        <UserList
          onClose={() => setShowUserList(false)}
          onUserSelect={handleUserSelect}
        />
      )}

      {showGroupModal && (
        <GroupChatModal
          onClose={() => setShowGroupModal(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </div>
  );
};

export default Chat;











