import Message from "../models/Message.model.js";
import { getIO } from "../config/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, businessId } = req.body;

    // 1. Validation: Fail fast if data is missing
    if (!message || !businessId) {
      return res.status(400).json({ message: "Message and Business ID are required" });
    }

    // 2. Save User Message
    const userMsg = await Message.create({
      business: businessId,
      sender: "user",
      content: message
    });

    // 3. Generate AI Reply (Placeholder)
    // TODO: Connect to OpenAI/Gemini API here later
    const aiReply = "Thanks for your message! We will get back to you.";

    const aiMsg = await Message.create({
      business: businessId,
      sender: "ai",
      content: aiReply
    });

    // 4. Socket Emission
    // We wrap this in a try-catch so if socket fails, the HTTP request still succeeds
    try {
      const io = getIO();
      // Use .toString() to ensure the room name is a string
      const roomName = businessId.toString();
      
      io.to(roomName).emit("new-message", userMsg);
      io.to(roomName).emit("new-message", aiMsg);
    } catch (socketError) {
      console.error("Socket emit failed:", socketError.message);
    }

    // 5. Response
    // Return both messages so the sender updates immediately (optional but helpful)
    res.status(201).json({ 
      userMessage: userMsg,
      aiMessage: aiMsg 
    });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Chat failed" });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!businessId) {
        return res.status(400).json({ message: "Business ID is required" });
    }

    const messages = await Message.find({ business: businessId })
      .sort({ createdAt: 1 }); // Oldest first (standard for chat)

    res.json(messages);
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};