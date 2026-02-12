import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true
    },
    sender: {
      type: String,
      enum: ["user", "ai"],
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
