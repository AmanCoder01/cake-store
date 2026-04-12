import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';

export const getCategories = createAsyncThunk('categories/getAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/categories`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: { items: [], isLoading: false },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => { state.isLoading = true; })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getCategories.rejected, (state) => { state.isLoading = false; });
  }
});

export default categorySlice.reducer;
