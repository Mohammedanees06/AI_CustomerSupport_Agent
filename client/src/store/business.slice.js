import { createSlice } from "@reduxjs/toolkit";

const storedBusiness = localStorage.getItem("business");

const initialState = {
  business: storedBusiness
    ? JSON.parse(storedBusiness)
    : null,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setBusiness(state, action) {
      state.business = action.payload;

      // save business for refresh + apiClient
      localStorage.setItem(
        "business",
        JSON.stringify(action.payload)
      );
    },

    clearBusiness(state) {
      state.business = null;
      localStorage.removeItem("business");
    },
  },
});

export const { setBusiness, clearBusiness } = businessSlice.actions;
export default businessSlice.reducer;