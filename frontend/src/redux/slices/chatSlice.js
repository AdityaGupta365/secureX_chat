

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chats';

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

export const createChat=createAsyncThunk(
    'chat/createChat',
    async (userId ,{rejectWithValue})=>{
        try{
          const response=await api.post('/oneonechat',{userId});
          return response.data;
        }
        catch(error){
          return rejectWithValue(error.response.data.message);
        }
    }
)
export const getChats = createAsyncThunk(
  'chat/getChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/getchats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createGroupChat = createAsyncThunk(
  'chat/createGroupChat',
  async ({ name, users }, { rejectWithValue }) => {
    try {
      const response = await api.post('/groupchat', { name, users });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


const chatSlice= createSlice({
    name:'chat',
    initialState:{
        chats:[],
        selectedChat:null,
        loading:false,
        error:null,
    },
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        clearSelectedChat: (state) => {
            state.selectedChat = null;
        },
    },
    extraReducers:(builder)=>{
        builder
           .addCase(createChat.pending,(state)=>{

            state.loading=true;
           })
          .addCase(createChat.fulfilled,(state,action)=>{
              state.loading=false;
              const existingChat=state.chats.find(
                chat=>chat._id===action.payload._id
              );
              if(!existingChat){
                state.chats.push(action.payload);
              }
              state.selectedChat=action.payload;
          })
          .addCase(createChat.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
          })
          .addCase(createGroupChat.fulfilled, (state, action) => {
        state.chats.push(action.payload);
        state.selectedChat = action.payload;
      })
      // Get Chats
      .addCase(getChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      });

    }

});


export const { setSelectedChat, clearSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
