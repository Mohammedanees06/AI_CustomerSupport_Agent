import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";

/* ================= FETCH MESSAGES ================= */

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/chat/${conversationId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch messages"
      );
    }
  }
);

/* ================= SEND MESSAGE ================= */

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/chat/send",
        messageData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to send message"
      );
    }
  }
);