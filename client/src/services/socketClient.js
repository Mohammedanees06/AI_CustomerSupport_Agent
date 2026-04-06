import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

let socket = null;

export const connectSocket = (token, businessId) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    query: { businessId },
    transports: ["websocket", "polling"],
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};