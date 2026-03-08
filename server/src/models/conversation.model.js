import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      default: null,
    },
    customerEmail: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "escalated", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;