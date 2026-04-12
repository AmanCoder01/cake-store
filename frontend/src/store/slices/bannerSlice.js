import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';

export const getBanners = createAsyncThunk('banners/getAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/banners`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const bannerSlice = createSlice({
  name: 'banners',
  initialState: { items: [], isLoading: false },
  extraReducers: (builder) => {
    builder
      .addCase(getBanners.pending, (state) => { state.isLoading = true; })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getBanners.rejected, (state) => { state.isLoading = false; });
  }
});

export default bannerSlice.reducer;
