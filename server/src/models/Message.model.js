import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true
    },

    sender: {
      type: String,
      enum: ["user", "ai"],
      required: true
    },

    content: {
      type: String,
      required: true
    },

    tokensUsed: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);