// import React from 'react';
// import { useSelector } from 'react-redux';

// const UserList = ({ onClose, onUserSelect }) => {
  
//   const { users } = useSelector((state) => state.auth);

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h3>Select User to Chat</h3>
//           <button className="close-button" onClick={onClose}>
//             ×
//           </button>
//         </div>
//         <div className="user-list">
//           {users.length === 0 ? (
//             <p>No users found</p>
//           ) : (
//             users.map((user) => (
//               <div
//                 key={user._id}
//                 className="user-item"
//                 onClick={() => onUserSelect(user._id)}
//               >
//                 <div className="user-avatar">👤</div>
//                 <div className="user-info">
//                   <h5>{user.username}</h5>
//                   <p>{user.email}</p>
//                   <span 
//                     className={`status ${user.isOnline ? 'online' : 'offline'}`}
//                   >
//                     {user.isOnline ? 'Online' : 'Offline'}
//                   </span>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserList;





import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../redux/slices/authSlice'; // Update path if needed

const UserList = ({ onClose, onUserSelect }) => {
  const dispatch = useDispatch();
  const { users, authLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Select User to Chat</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="user-list">
          {authLoading && <p>Loading users...</p>}
          {error && <p className="error">{error}</p>}
          {!authLoading && users.length === 0 && <p>No users found</p>}
          {users.map((user) => (
            <div
              key={user._id}
              className="user-item"
              onClick={() => onUserSelect(user._id)}
            >
              <div className="user-avatar">👤</div>
              <div className="user-info">
                <h5>{user.username}</h5>
                <p>{user.email}</p>
                <span className={`status ${user.isOnline ? 'online' : 'offline'}`}>
                  {user.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
