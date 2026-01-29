




import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const MessageArea = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const { messages } = useSelector((state) => state.message);
  const { selectedChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getChatName = () => {
    if (!selectedChat) return '';
    
    if (selectedChat.isGroupChat) {
      return selectedChat.name;
    } else {
      const otherUser = selectedChat.users.find((u) => u._id !== user.id);
      return otherUser ? otherUser.username : 'Unknown User';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  // --- FIXED FUNCTION STARTS HERE ---
  const formatTime = (date) => {
    // Handle cases where createdAt might be undefined (e.g., immediate local update)
    if (!date) {
      // Option A: Return empty string
      // return ''; 
      
      // Option B: Return current time (Good for 'Just now' feel)
      return new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    const dateObj = new Date(date);

    // Check if the date object is valid
    if (isNaN(dateObj.getTime())) {
      return '';
    }

    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  // --- FIXED FUNCTION ENDS HERE ---

  return (
    <div className="message-area">
      <div className="message-header">
        <div className="chat-info">
          <h3>{getChatName()}</h3>
          {selectedChat?.isGroupChat && (
            <p>{selectedChat.users.length} members</p>
          )}
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${msg.sender._id === user.id ? 'own-message' : ''}`}
          >
            <div className="message-content">
              {msg.sender._id !== user.id && (
                <div className="sender-name">{msg.sender.username}</div>
              )}
              <div className="message-text">{msg.content}</div>
              {/* Only render time div if we successfully formatted a time */}
              <div className="message-time">{formatTime(msg.createdAt)}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageArea;