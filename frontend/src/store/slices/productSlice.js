import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';

const API_URL = `${APP_CONFIG.API_BASE_URL}/products`;

export const getProducts = createAsyncThunk('products/getAll', async (query = '', thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}?${query}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getProductDetails = createAsyncThunk('products/getDetails', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = {
  products: [],
  product: null,
  totalProducts: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload.data.products;
        state.totalProducts = action.payload.total;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload.data.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
