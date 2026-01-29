import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const GroupChatModal = ({ onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { users } = useSelector((state) => state.auth);

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim() && selectedUsers.length > 0) {
      onGroupCreated({
        name: groupName,
        users: selectedUsers,
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create Group Chat</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>
          <div className="user-selection">
            <h4>Select Users:</h4>
            {users.map((user) => (
              <div key={user._id} className="user-checkbox">
                <input
                  type="checkbox"
                  id={user._id}
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => handleUserToggle(user._id)}
                />
                <label htmlFor={user._id}>
                  <span className="user-avatar">👤</span>
                  {user.username}
                </label>
              </div>
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!groupName.trim() || selectedUsers.length === 0}
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupChatModal;