import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    role: {
  type: String,
  enum: ["owner", "staff"],
  default: "owner"
}

  },
  { timestamps: true }
);



export default mongoose.model("User", UserSchema);
