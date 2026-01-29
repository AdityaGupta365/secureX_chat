


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { decryptMessage } from '../../utils/encryption.js';
// import { encryptMessage } from '../../utils/encryption.js';
// const API_URL = 'http://localhost:5000/api/';

// const api = axios.create({
//   baseURL: API_URL,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Get messages for a chat
// export const getMessages = createAsyncThunk(
//   'message/getMessages',
//   async (chatId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/messages/${chatId}`);
//       const decryptedMessages = response.data.map(msg=>({
//         ...msg,content:decryptMessage(msg.content)
//       }));
//       return decryptedMessages;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );

// // Send message
// export const sendMessage = createAsyncThunk(
//   'message/sendMessage',
//   async ({ content, chatId }, { rejectWithValue }) => {
//     try {
//       const encryptedContent = encryptMessage(content);
//       const response = await api.post('/messages/sendmessages/', { content:encryptedContent, chatId });
//       return {
//         ...response.data,
//         content: decryptMessage(response.data.content)
//       };
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );

// const messageSlice = createSlice({
//   name: 'message',
//   initialState: {
//     messages: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     addMessage: (state, action) => {
//       state.messages.push(action.payload);
//     },
//     clearMessages: (state) => {
//       state.messages = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Get Messages
//       .addCase(getMessages.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getMessages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.messages = action.payload;
//       })
//       .addCase(getMessages.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Send Message
//       .addCase(sendMessage.fulfilled, (state, action) => {
//         // Message will be added via socket
//       });
//   },
// });

// export const { addMessage, clearMessages } = messageSlice.actions;
// export default messageSlice.reducer;




// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { encryptMessage, decryptMessage } from '../../utils/encryption'; // Import utils

// const API_URL = 'http://localhost:5000/api/';

// const api = axios.create({
//   baseURL: API_URL,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // 1. Decrypt messages when fetching history
// export const getMessages = createAsyncThunk(
//   'message/getMessages',
//   async (chatId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/messages/${chatId}`);
//       // Decrypt every message content before returning to state
//       const decryptedMessages = response.data.map(msg => ({
//         ...msg,
//         content: decryptMessage(msg.content)
//       }));
//       return decryptedMessages;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Error fetching messages');
//     }
//   }
// );

// // 2. Encrypt message before sending to Database API
// export const sendMessage = createAsyncThunk(
//   'message/sendMessage',
//   async ({ content, chatId }, { rejectWithValue }) => {
//     try {
//       const encryptedContent = encryptMessage(content); // Encrypt here
//       const response = await api.post('/messages/sendmessages/', { 
//         content: encryptedContent, 
//         chatId 
//       });
//       // The server returns the saved message (encrypted). 
//       // We decrypt it immediately for our own UI state.
//       return {
//         ...response.data,
//         content: decryptMessage(response.data.content)
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Error sending message');
//     }
//   }
// );

// const messageSlice = createSlice({
//   name: 'message',
//   initialState: {
//     messages: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     addMessage: (state, action) => {
//       state.messages.push(action.payload);
//     },
//     clearMessages: (state) => {
//       state.messages = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getMessages.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getMessages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.messages = action.payload; // These are now decrypted
//       })
//       .addCase(getMessages.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(sendMessage.fulfilled, (state, action) => {
//         // Optional: Ensure sent message is added to state (if not using socket for own messages)
//         // state.messages.push(action.payload);
//       });
//   },
// });

// export const { addMessage, clearMessages } = messageSlice.actions;
// export default messageSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { encryptMessage, decryptMessage } from '../../utils/encryption.js';

const API_URL = 'http://localhost:5000/api/';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Get Messages (Decrypts history)
export const getMessages = createAsyncThunk(
  'message/getMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/messages/${chatId}`);
      
      // Decrypt all messages from history
      const decryptedMessages = response.data.map((msg) => ({
        ...msg,
        content: decryptMessage(msg.content)
      }));
      
      return decryptedMessages;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching messages');
    }
  }
);

// 2. Send Message (Encrypts before sending)
export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async ({ content, chatId }, { rejectWithValue }) => {
    try {
      // A. Encrypt content
      const encryptedContent = encryptMessage(content);
      
      // B. Send Encrypted content to Database
      const response = await api.post('/messages/sendmessages/', { 
        content: encryptedContent, 
        chatId 
      });

      // C. The server returns the SAVED (encrypted) object. 
      // We must decrypt it immediately so the SENDER sees the plain text.
      return {
        ...response.data, // Contains _id, sender, createdAt, etc.
        content: decryptMessage(response.data.content) // Overwrite encrypted content with plain text
      };

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error sending message');
    }
  }
);

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Messages
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Send Message (Update sender's UI immediately on success)
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { addMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;