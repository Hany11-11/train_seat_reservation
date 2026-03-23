import mongoose from "mongoose";

const trainSchema = new mongoose.Schema(
  {
    train: { type: String, required: true }, // Train name or code
    number: { type: String, required: true, unique: true },
    description: { type: String },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true },
);

export default mongoose.model("Train", trainSchema);
