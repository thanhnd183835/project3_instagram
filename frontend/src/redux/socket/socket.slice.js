import { createSlice } from '@reduxjs/toolkit';
// import axiosInstance from '../../services/config.js';

const initialState = {
  loading: false,
  error: '',
  socket: { code: 0, data: {} },
};

const socketSlice = createSlice({
  name: 'post',
  initialState: initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action;
    },
  },
  extraReducers: {},
});
export const { setSocket } = socketSlice.actions;
export const { reducer: socketReducer } = socketSlice;
export default socketReducer;
