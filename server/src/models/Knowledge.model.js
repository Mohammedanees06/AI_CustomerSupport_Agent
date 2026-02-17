import mongoose from "mongoose";

const KnowledgeSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true
    },
    content: {
      type: String,
      required: true
    },
    embedding: {
      type: [Number], // vector
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Knowledge", KnowledgeSchema);
