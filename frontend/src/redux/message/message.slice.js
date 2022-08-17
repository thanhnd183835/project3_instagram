import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: '',
  modal: {
    show: false,
    type: 'ERROR',
    msg: '',
  },
};

const messageSlice = createSlice({
  name: 'message',
  initialState: initialState,
  reducers: {
    pushMessage: (state, action) => {
      state.modal.msg = action.payload.msg;
    },

    showModalMessage: (state, action) => {
      return {
        ...state,
        modal: {
          ...action.payload,
          show: true,
        },
      };
    },

    hideModalMessage: (state) => {
      state.modal.show = false;
    },
  },
  extraReducers: {},
});

export const { pushMessage, showModalMessage, hideModalMessage } = messageSlice.actions;

export const { reducer: messageReducer } = messageSlice;
export default messageReducer;
