import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';

const API_URL = `${APP_CONFIG.API_BASE_URL}/wishlist`;

export const getWishlist = createAsyncThunk('wishlist/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.post(`${API_URL}/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { productId, ...response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  message: ''
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    resetWishlist: (state) => {
      state.items = [];
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data.items;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (action.payload.action === 'added') {
            state.items.push({ 
                _id: Date.now().toString(), // temporary id
                product: action.payload.productId,
                createdAt: new Date().toISOString()
            });
        } else if (action.payload.action === 'removed') {
            state.items = state.items.filter(item => {
                const pId = item.product?._id || item.product;
                return pId !== action.payload.productId;
            });
        }
      });
  }
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
