// import logo from './logo.svg';
// import './App.css';
// import React from 'react'
// import Register from './components/Register';
// import Login from './components/Login';
// import Chat from './components/Chat';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// function App() {
//   const { token } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (token) {
//       dispatch(getUsers());
//     }
//   }, [token, dispatch]);

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route 
//             path="/login" 
//             element={!token ? <Login /> : <Navigate to="/chat" />} 
//           />
//           <Route 
//             path="/register" 
//             element={!token ? <Register /> : <Navigate to="/chat" />} 
//           />
//           <Route 
//             path="/chat" 
//             element={token ? <Chat /> : <Navigate to="/login" />} 
//           />
//           <Route 
//             path="/" 
//             element={<Navigate to={token ? "/chat" : "/login"} />} 
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;






import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { getMessages, addMessage, clearMessages } from './redux/slices/messageSlice';
import { getUsers } from './redux/slices/authSlice'; // ✅ Make sure this exists
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

import './App.css';
import logo from './logo.svg';

function App() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(getUsers());
    }
  }, [token, dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!token ? <Login /> : <Navigate to="/chat" />} 
          />
          <Route 
            path="/register" 
            element={!token ? <Register /> : <Navigate to="/chat" />} 
          />
          <Route 
            path="/chat" 
            element={token ? <Chat /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={token ? "/chat" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

