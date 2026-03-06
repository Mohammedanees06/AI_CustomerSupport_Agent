import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
  initialized: false, //  Wait… checking authentication.
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.initialized = true;

      // persist session
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.initialized = true;
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.initialized = true;

      localStorage.clear();
    },

    //  this runs on app startup , When page refreshes Redux memory is  cleared ,Token still in localStorage  exists
    restoreSession(state) {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }

      state.initialized = true; // unlock UI render
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  restoreSession, //  export this
} = authSlice.actions;

export default authSlice.reducer;