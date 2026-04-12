import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';

const API_URL = `${APP_CONFIG.API_BASE_URL}/auth`;

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const signup = createAsyncThunk('auth/signup', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  user: user ? user : null,
  token: token ? token : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    logout: (state) => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data.user;
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      });
  }
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
