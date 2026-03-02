import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import appReducer from "./app.slice";
import businessReducer from "./business.slice";
import chatReducer from "./chat.slice";
import voiceReducer from "./voice.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    business: businessReducer,
    chat: chatReducer,
    voice: voiceReducer,
  },
});

export default store; 