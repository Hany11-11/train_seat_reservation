import mongoose from "mongoose";

import { USER_ROLES } from "../constants/auth.constants.js";

const userSchema = new mongoose.Schema(
  {
    nic: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 20,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ nic: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

export default User;
