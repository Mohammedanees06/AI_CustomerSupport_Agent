import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token, businessId) => {
  if (socket) return socket;

  socket = io("http://localhost:5000", {
    auth: { token },
    query: { businessId },
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