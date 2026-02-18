import mongoose from "mongoose";

/**
 * WHY THIS MODEL?
 * 
 * We store metrics per business.
 * This helps generate dashboard stats.
 */

const AnalyticsSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      unique: true
    },

    totalMessages: { type: Number, default: 0 },
    totalAIResponses: { type: Number, default: 0 },
    totalOrderLookups: { type: Number, default: 0 },
    totalTicketsCreated: { type: Number, default: 0 }

  },
  { timestamps: true }
);

export default mongoose.model("Analytics", AnalyticsSchema);
