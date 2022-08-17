import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/config.js';

export const getPosts = createAsyncThunk('post/get-posts', async () => {
  try {
    return await axiosInstance.get(`/api/post/get-posts`);
  } catch (error) {
    console.log(error);
  }
});

export const getPostById = createAsyncThunk('post/get-post', async (params) => {
  try {
    return await axiosInstance.get(`/api/post/get-post/${params}`);
  } catch (error) {
    console.log(error);
  }
});

export const reactApi = createAsyncThunk('post/like', async (params) => {
  try {
    return await axiosInstance.post(`/api/post/like/${params}`);
  } catch (error) {
    return error;
  }
});

export const commentApi = createAsyncThunk('post/comment', async (data) => {
  try {
    const { postId, userId, content } = await data;
    return await axiosInstance.post(`/api/post/comment/${postId}`, { userId, content });
  } catch (error) {
    return error;
  }
});

export const getPostMe = createAsyncThunk('post/get-post-for-me', async () => {
  try {
    return await axiosInstance.get(`/api/post/get-post-for-me`);
  } catch (error) {
    return error;
  }
});

export const getPostFriend = createAsyncThunk('post/get-post-for-friend', async (id) => {
  try {
    return await axiosInstance.get(`/api/post/get-post-for-friend/${id}`);
  } catch (error) {
    return error;
  }
});

export const removeCommentApi = createAsyncThunk('post/remove-comment', async (body) => {
  try {
    return await axiosInstance.post(`/api/post/remove-comment`, body);
  } catch (error) {
    return error;
  }
});

export const removePostApi = createAsyncThunk('post/remove-comment', async (postId) => {
  try {
    return await axiosInstance.post(`/api/post/remove-post/${postId}`);
  } catch (error) {
    return error;
  }
});

export const getListUserLiked = createAsyncThunk('post/get-users-liked', async (postId) => {
  try {
    return await axiosInstance.get(`/api/post/get-users-liked/${postId}`);
  } catch (error) {
    return error;
  }
});


export const deletePostApi = createAsyncThunk('post/delete-post', async (postId) => {
  try {
    return await axiosInstance.post(`/api/post/delete-post/${postId}`);
  } catch (error) {
    return error;
  }
});

const initialState = {
  loading: false,
  error: '',
  post: { code: 0, data: {} },
  postOfMe: { code: 0, data: {} },
  postOfFriend: { code: 0, data: {} },
  postDelete: { code: 0, data: {}}
};

const postSlice = createSlice({
  name: 'post',
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [`${getPostMe.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getPostMe.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getPostMe.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.postOfMe = action.payload.data;
    },

    [`${getPostFriend.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getPostFriend.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getPostFriend.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.postOfFriend = action.payload.data;
    },

    [`${getPostById.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getPostById.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getPostById.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.post = action.payload.data;
    },

    [`${deletePostApi.pending}`]: (state) => {
      state.loading = true;
    },
    [`${deletePostApi.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${deletePostApi.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.postDelete = action.payload.data;
    },
  },
});
export const { reducer: postReducer } = postSlice;
export default postReducer;
