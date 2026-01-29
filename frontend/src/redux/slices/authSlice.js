// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Optional: Set base URL if needed
// const api = axios.create({
//   baseURL: 'http://localhost:5000/api', // Change as per your backend
// });

// // ---------------------- Async Thunks ------------------------

// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async ({ username, email, password }, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/auth/register', {
//         username,
//         email,
//         password,
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Registration failed');
//     }
//   }
// );

// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/auth/login', { email, password });
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Login failed');
//     }
//   }
// );

// export const getUsers = createAsyncThunk(
//   'auth/getUsers',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/users');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
//     }
//   }
// );

// // ---------------------- Initial State ------------------------

// const initialState = {
//   user: JSON.parse(localStorage.getItem('user')) || null,
//   token: localStorage.getItem('token') || null,
//   users: [],
//   authLoading: false,
//   error: null,
// };

// // ---------------------- Slice Definition ------------------------

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     logout: (state) => {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       state.user = null;
//       state.token = null;
//       state.users = [];
//       state.error = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder

//       // -------- Register User --------
//       .addCase(registerUser.pending, (state) => {
//         state.authLoading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.authLoading = false;
//         state.user = action.payload.user;
//         // Optional: save to localStorage if you want
//         localStorage.setItem('user', JSON.stringify(action.payload.user));
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.authLoading = false;
//         state.error = action.payload;
//       })

//       // -------- Login User --------
//       .addCase(loginUser.pending, (state) => {
//         state.authLoading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.authLoading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.authLoading = false;
//         state.error = action.payload;
//       })

//       // -------- Get All Users --------
//       .addCase(getUsers.pending, (state) => {
//         state.authLoading = true;
//         state.error = null;
//       })
//       .addCase(getUsers.fulfilled, (state, action) => {
//         state.authLoading = false;
//         state.users = action.payload;
//       })
//       .addCase(getUsers.rejected, (state, action) => {
//         state.authLoading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // ---------------------- Export ------------------------

// export const { logout, clearError } = authSlice.actions;
// export default authSlice.reducer;




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ---------------------- Axios Instance ------------------------
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this to your backend URL
});

// Axios interceptor to attach token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------- Async Thunks ------------------------

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const getUsers = createAsyncThunk(
  'auth/getUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/users');
      console.log('Fetched users:', response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// ---------------------- Initial State ------------------------

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  users: [],
  authLoading: false,
  error: null,
};

// ---------------------- Slice ------------------------

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.users = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // -------- Register --------
      .addCase(registerUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      // -------- Login --------
      .addCase(loginUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      // -------- Get Users --------
      .addCase(getUsers.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.authLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      });
  },
});

// ---------------------- Exports ------------------------

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
