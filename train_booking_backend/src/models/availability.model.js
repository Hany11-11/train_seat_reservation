import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    date: { type: String, required: true }, // e.g. "2026-03-21"
    classType: { type: String, enum: ["1ST", "2ND", "3RD"], required: true },
    availableSeats: { type: Number, required: true },
  },
  { timestamps: true },
);
availabilitySchema.index(
  { schedule: 1, date: 1, classType: 1 },
  { unique: true },
);

export default mongoose.model("Availability", availabilitySchema);
