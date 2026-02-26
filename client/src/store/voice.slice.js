import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isRinging: false,
  isActive: false,
  isMuted: false,
  loading: false,
  error: null,
};

const voiceSlice = createSlice({
  name: "voice",
  initialState,
  reducers: {
    startRinging: (state) => {
      state.isRinging = true;
    },

    stopRinging: (state) => {
      state.isRinging = false;
    },

    startCall: (state) => {
      state.isActive = true;
      state.isRinging = false;
    },

    endCall: (state) => {
      state.isActive = false;
      state.isMuted = false;
    },

    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
  },
});

export const {
  startRinging,
  stopRinging,
  startCall,
  endCall,
  toggleMute,
} = voiceSlice.actions;

export default voiceSlice.reducer; 