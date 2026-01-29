import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { setSelectedChat } from '../slices/chatSlice';
import { setSelectedChat} from '../redux/slices/chatSlice';

const ChatList = () => {
  const dispatch = useDispatch();
  const { chats, selectedChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const getChatName = (chat) => {
    if (chat.isGroupChat) {
      return chat.name;
    } else {
      const otherUser = chat.users.find((u) => u._id !== user.id);
      return otherUser ? otherUser.username : 'Unknown User';
    }
  };

  const handleChatSelect = (chat) => {
    dispatch(setSelectedChat(chat));
  };

  return (
    <div className="chat-list">
      <h4>Chats</h4>
      {chats.length === 0 ? (
        <p>No chats yet. Start a new conversation!</p>
      ) : (
        chats.map((chat) => (
          <div
            key={chat._id}
            className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
            onClick={() => handleChatSelect(chat)}
          >
            <div className="chat-avatar">
              {chat.isGroupChat ? '👥' : '👤'}
            </div>
            <div className="chat-info">
              <h5>{getChatName(chat)}</h5>
              <p>{chat.isGroupChat ? `${chat.users.length} members` : 'Private chat'}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;