import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/userService";

const initialState = {
  user: {},
  following: [],
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Get user details, for edit data
export const profile = createAsyncThunk(
  "user/profile",
  async (user, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await userService.profile(user, token);

    return data;
  }
);

// Update user details
export const updateProfile = createAsyncThunk(
  "user/update",
  async (user, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await userService.updateProfile(user, token);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    console.log(data);

    return data;
  }
);

// Get user details
export const getUserDetails = createAsyncThunk(
  "user/get",
  async (id, thunkAPI) => {
    const data = await userService.getUserDetails(id);

    return data;
  }
);

export const followUser = createAsyncThunk(
  "user/followUser",
  async (dataUser, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    let id = dataUser.id;
    let userId = dataUser.userId;
    const data = await userService.followUser(id, userId, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data; // Certifique-se de que a resposta tem a estrutura esperada
  }
);

export const unfollowUser = createAsyncThunk(
  "user/unfollowUser",
  async (dataUser, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    let id = dataUser.id;
    let userId = dataUser.userId;
    const data = await userService.unfollowUser(id, userId, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data; // Certifique-se de que a resposta tem a estrutura esperada
  }
);

// Se necessário, adicione ações para obter seguidores e seguidos
export const getFollowers = createAsyncThunk(
  "user/followers",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await userService.getFollowers(id, token);

    return data;
  }
);
export const getFollowing = createAsyncThunk(
  "user/following",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await userService.getFollowing(id, token);

    return data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
        state.message = "Usuário atualizado com sucesso!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Seguindo com sucesso!";
        const newUser = action.payload;

        if (newUser) {
          // Atualiza o estado global seguindo
          state.user.following.push(newUser._id);
        }

        // Chama getFollowers e getFollowing para garantir atualização
        state.success = true;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Deixou de seguir com sucesso!";
        const unfollowUserId = action.payload._id;

        // Atualiza a lista de quem o usuário segue
        state.user.following = state.user.following.filter(
          (userId) => userId !== unfollowUserId
        );

        // Chama getFollowers e getFollowing para garantir atualização
        state.success = true;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Followers
      .addCase(getFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.followers = action.payload; // Atualiza seguidores no estado
      })
      .addCase(getFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Following
      .addCase(getFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.following = action.payload; // Atualiza quem o usuário segue
      })
      .addCase(getFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMessage } = userSlice.actions;
export default userSlice.reducer;
