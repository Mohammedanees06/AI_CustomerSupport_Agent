import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true
    },

    // ✅ Link to the conversation so agent can view full chat
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null
    },

    customerMessage: {
      type: String,
      required: true
    },

    // ✅ AI's response that wasn't satisfactory
    aiResponse: {
      type: String,
      default: null
    },

    // ✅ AI confidence score that triggered escalation
    confidenceScore: {
      type: Number,
      default: null
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open"
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", TicketSchema);