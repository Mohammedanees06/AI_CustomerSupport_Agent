import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    activeConversationId: null,
    messagesByConversation: {}, // { [conversationId]: [] }
    loading: false,
  },
  reducers: {
    setConversations(state, action) {
      state.conversations = action.payload;
    },

    setActiveConversation(state, action) {
      state.activeConversationId = action.payload;
    },

    setMessages(state, action) {
      const { conversationId, messages } = action.payload;
      state.messagesByConversation[conversationId] = messages;
    },

    addMessage(state, action) {
      const message = action.payload;
      const conversationId = message.conversation;

      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }

      state.messagesByConversation[conversationId].push(message);
    },

    setChatLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {
  setConversations,
  setActiveConversation,
  setMessages,
  addMessage,
  setChatLoading,
} = chatSlice.actions;

export default chatSlice.reducer;