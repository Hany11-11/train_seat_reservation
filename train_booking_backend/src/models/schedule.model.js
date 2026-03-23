import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },
    fromStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    toStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    route: [
      {
        station: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Station",
          required: true,
        },
        arrivalTime: { type: String },
        departureTime: { type: String },
      },
    ],
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true },
);

export default mongoose.model("Schedule", scheduleSchema);
