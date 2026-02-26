import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import chatReducer from "./chat.slice";
import voiceReducer from "./voice.slice";
import appReducer from "./app.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    voice: voiceReducer,
    app: appReducer,
  },
});

export default store;   