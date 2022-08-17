import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/config.js';

export const signUp = createAsyncThunk('auth/sign-up', async (body) => {
  try {
    return await axiosInstance.post(`/api/auth/sign-up`, body);
  } catch (error) {
    throw error;
  }
});

export const signIn = createAsyncThunk('auth/sign-in', async (body) => {
  try {
    return await axiosInstance.post(`/api/auth/sign-in`, body);
  } catch (error) {
    console.log(error);
    return error;
  }
});
export const getMe = createAsyncThunk('user/get-me', async () => {
  try {
    return await axiosInstance.get(`/api/user/get-me`);
  } catch (error) {
    console.log(error);
    return error;
  }
});

export const editProfile = createAsyncThunk('user/edit-profile', async (body) => {
  try {
    return await axiosInstance.post(`/api/user/edit-profile`, body);
  } catch (error) {
    throw error;
  }
});

export const replacePassword = createAsyncThunk('auth/replace-password', async (body) => {
  try {
    return await axiosInstance.post(`/api/auth/replace-password`, body);
  } catch (error) {
    throw error;
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    return await axiosInstance.post(`/api/user/logout`);
  } catch (error) {
    throw error;
  }
});

const initialState = {
  loading: false,
  error: '',
  auth: { code: 0, data: {} },
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: {
    // đang load
    [`${signIn.pending}`]: (state) => {
      state.loading = true;
    },
    //huy
    [`${signIn.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    //hoàn thành
    [`${signIn.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },

    [`${getMe.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getMe.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getMe.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },

    [`${editProfile.pending}`]: (state) => {
      state.loading = true;
    },
    [`${editProfile.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${editProfile.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },

    //logout
    [`${logout.pending}`]: (state) => {
      state.loading = true;
    },
    [`${logout.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${logout.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
  },
});
export const { reducer: authReducer } = authSlice;
export default authReducer;
