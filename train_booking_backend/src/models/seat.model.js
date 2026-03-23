import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },
    coachName: { type: String, required: true }, // e.g., A1, B1
    classType: { type: String, enum: ["1ST", "2ND", "3RD"], required: true },
    rows: { type: Number, required: true },
    seatsPerRow: { type: Number, required: true },
    layout: { type: String }, // e.g., 2-2
    totalSeats: { type: Number },
  },
  { timestamps: true },
);

seatSchema.index({ train: 1, coachName: 1 }, { unique: true });

// Set totalSeats before save
seatSchema.pre("save", async function () {
  this.totalSeats = this.rows * this.seatsPerRow;
});

// Set totalSeats before update
seatSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update.rows != null && update.seatsPerRow != null) {
    update.totalSeats = update.rows * update.seatsPerRow;
  }
});

export default mongoose.model("Seat", seatSchema);
