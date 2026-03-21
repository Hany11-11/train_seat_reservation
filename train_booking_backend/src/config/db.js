import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/train_seat_booking";

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

export default connectDB;
