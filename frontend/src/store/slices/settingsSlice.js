import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';

const API_URL = `${APP_CONFIG.API_BASE_URL}/settings`;

export const getSettings = createAsyncThunk('settings/getSettings', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data.settings;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateSetting = createAsyncThunk('settings/updateSetting', async (settingData, thunkAPI) => {
  try {
    const { token } = thunkAPI.getState().auth;
    const response = await axios.patch(API_URL, settingData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data.setting;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  settings: {
    isOutletOpen: true
  },
  isLoading: false,
  isError: false,
  message: ''
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetSettingsState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateSetting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSetting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings[action.payload.key] = action.payload.value;
      })
      .addCase(updateSetting.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { resetSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;
