import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    theme: "light",
    language: "en",
    alerts: [],
    loading: false, // global API loading state
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    setLanguage: (state, action) => {
      state.language = action.payload;
    },

    // reducer used by apiClient interceptor
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

//  export  action also
export const { setTheme, setLanguage, setLoading } =
  appSlice.actions;

export default appSlice.reducer;