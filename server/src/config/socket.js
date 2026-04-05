import { Server } from "socket.io";
import Redis from "ioredis";

let io;

// Separate Redis client for subscribing (cannot share with BullMQ client)
const subscriber = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // ============================================
  // REDIS SUBSCRIBER
  // Listens for events published by the worker
  // and emits them to the correct socket room
  // ============================================
  subscriber.subscribe("socket:events", (err) => {
    if (err) {
      console.error("Redis subscriber error:", err);
    } else {
      console.log("Socket event subscriber ready");
    }
  });

  subscriber.on("message", (channel, raw) => {
    if (channel !== "socket:events") return;

    try {
      const { room, event, data } = JSON.parse(raw);
      io.to(room).emit(event, data); // ✅ real io instance — this works
      console.log(`Socket emitted [${event}] to room [${room}]`);
    } catch (err) {
      console.error("Failed to parse socket event:", err);
    }
  });

  // ============================================
  // SOCKET CONNECTION HANDLERS
  // ============================================
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-business", (businessId) => {
      if (!businessId) return;
      socket.join(businessId.toString());
      console.log(`Socket ${socket.id} joined business ${businessId}`);
    });

    socket.on("join-conversation", ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(conversationId.toString());
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on("leave-conversation", ({ conversationId }) => {
      if (!conversationId) return;
      socket.leave(conversationId.toString());
      console.log(`Socket ${socket.id} left conversation ${conversationId}`);
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