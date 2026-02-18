import mongoose from "mongoose";

/**
 * WHY THIS MODEL?
 * 
 * AI cannot answer dynamic order questions using RAG.
 * Order data must come from structured DB.
 * 
 * Example questions:
 * - "Where is my order #123?"
 * - "Has order 456 been shipped?"
 */

const OrderSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true
    },

    orderNumber: {
      type: String,
      required: true
    },

    customerEmail: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing"
    },

    trackingNumber: {
      type: String
    },

    totalAmount: {
      type: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
