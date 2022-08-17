import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/config.js';

export const getListUserSuggestion = createAsyncThunk('user/get-user-suggest', async () => {
  try {
    return await axiosInstance.get(`/api/user/get-user-suggest`);
  } catch (error) {
    throw error;
  }
});

export const getAllUserSuggest = createAsyncThunk('user/get-all-user-suggest', async () => {
  try {
    return await axiosInstance.get(`/api/user/get-all-suggest`);
  } catch (error) {
    throw error;
  }
});

export const followApi = createAsyncThunk('user/follow', async (params) => {
  try {
    return await axiosInstance.post(`/api/user/follow/${params}`);
  } catch (error) {
    throw error;
  }
});

export const unFollowApi = createAsyncThunk('user/un-follow', async (params) => {
  try {
    return await axiosInstance.post(`/api/user/un-follow/${params}`);
  } catch (error) {
    throw error;
  }
});

export const acceptFollowApi = createAsyncThunk('user/accept-follow', async (params) => {
  try {
    return await axiosInstance.post(`/api/user/accept-follow/${params}`);
  } catch (error) {
    throw error;
  }
});

export const removeRequestApi = createAsyncThunk('user/remove-request', async (params) => {
  try {
    return await axiosInstance.post(`/api/user/remove-request/${params}`);
  } catch (error) {
    throw error;
  }
});


export const searchUser = createAsyncThunk('user/search', async (query) => {
  try {
    return await axiosInstance.get(`/api/user/search?name=${query}`);
  } catch (error) {
    throw error;
  }
});

export const getFollowers = createAsyncThunk('user/get-followers', async () => {
  try {
    return await axiosInstance.get(`/api/user/get-all-follower`);
  } catch (error) {
    throw error;
  }
});

export const getFollowing = createAsyncThunk('user/get-following', async () => {
  try {
    return await axiosInstance.get(`/api/user/get-all-following`);
  } catch (error) {
    throw error;
  }
});

export const blockApi = createAsyncThunk('user/block', async (params) => {
  console.log(params);
  try {
    return await axiosInstance.post(`/api/user/block/${params}`);
  } catch (error) {
    throw error;
  }
});

export const getProfileFriend = createAsyncThunk('user/get-profile-friend', async (id) => {
  try {
    return await axiosInstance.get(`/api/user/profile-friend/${id}`);
  } catch (error) {
    throw error;
  }
});

export const unBlockApi = createAsyncThunk('user/un-block', async (params) => {
  try {
    return await axiosInstance.post(`/api/user/un-block/${params}`);
  } catch (error) {
    throw error;
  }
});

const initialState = {
  loading: false,
  error: '',
  user: { code: 0, data: {} },
  userSuggest: { code: 0, data: {} },
  followers: { code: 0, data: {} },
  following: { code: 0, data: {} },
  blockUser: { code: 0, success: false },
  unBlockUser: { code: 0, success: false },
  searchUser: { code: 0, data: {} },
  profileFriend: { code: 0, data: {} },
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  extraReducers: {
    [`${getListUserSuggestion.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getListUserSuggestion.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getListUserSuggestion.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.userSuggest = action.payload;
    },

    // list follower
    [`${getFollowers.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getFollowers.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getFollowers.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.followers = action.payload;
    },

    // list following
    [`${getFollowing.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getFollowing.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getFollowing.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.following = action.payload;
    },

    //block user
    [`${blockApi.pending}`]: (state) => {
      state.loading = true;
    },
    [`${blockApi.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${blockApi.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.blockUser = { code: 0, success: true };
    },

    //un-block user
    [`${unBlockApi.pending}`]: (state) => {
      state.loading = true;
    },
    [`${unBlockApi.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${unBlockApi.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.unBlockUser = { code: 0, success: true };
    },

    // get profile friends
    [`${getProfileFriend.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getProfileFriend.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getProfileFriend.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.profileFriend = action.payload;
    },

    //unfollow user
    [`${unFollowApi.pending}`]: (state) => {
      state.loading = true;
    },
    [`${unFollowApi.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${unFollowApi.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.following = action.payload
    },

    //follow user
    [`${followApi.pending}`]: (state) => {
      state.loading = true;
    },
    [`${followApi.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${followApi.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.following = action.payload
    },

    //accept request follow
    [`${acceptFollowApi.pending}`]: (state) => {
      state.loading = true;
    },
    [`${acceptFollowApi.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${acceptFollowApi.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.followers = action.payload
    },
  },
});
export const { reducer: userReducer } = userSlice;
export default userReducer;
