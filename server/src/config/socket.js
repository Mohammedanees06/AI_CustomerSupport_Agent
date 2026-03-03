import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    /**
     * ============================================
     * JOIN BUSINESS ROOM (Admin Dashboard Use)
     * ============================================
     */
    socket.on("join-business", (businessId) => {
      if (!businessId) return;

      socket.join(businessId.toString());
      console.log(`Socket ${socket.id} joined business ${businessId}`);
    });

    /**
     * ============================================
     * JOIN CONVERSATION ROOM (Customer Chat Use)
     * ============================================
     */
    socket.on("join-conversation", ({ conversationId }) => {
      if (!conversationId) return;

      socket.join(conversationId.toString());
      console.log(
        `Socket ${socket.id} joined conversation ${conversationId}`
      );
    });

    /**
     * ============================================
     * LEAVE CONVERSATION (Optional but good practice)
     * ============================================
     */
    socket.on("leave-conversation", ({ conversationId }) => {
      if (!conversationId) return;

      socket.leave(conversationId.toString());
      console.log(
        `Socket ${socket.id} left conversation ${conversationId}`
      );
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};