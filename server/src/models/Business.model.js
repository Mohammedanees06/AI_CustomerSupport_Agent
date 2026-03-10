import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    twilioNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Business", BusinessSchema);