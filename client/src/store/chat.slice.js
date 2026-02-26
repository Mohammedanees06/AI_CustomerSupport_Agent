import { createSlice } from "@reduxjs/toolkit";
import { fetchMessages, sendMessage } 
from "@/features/chat/chat.thunks";


const initialState = {
  messages: [],
  activeConversationId: null,
  unreadCount: 0,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    incrementUnread: (state) => {
      state.unreadCount += 1;
    },

    resetUnread: (state) => {
      state.unreadCount = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= FETCH MESSAGES ================= */

      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= SEND MESSAGE ================= */

      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setActiveConversation,
  addMessage,
  clearMessages,
  incrementUnread,
  resetUnread,
} = chatSlice.actions;

export default chatSlice.reducer;   