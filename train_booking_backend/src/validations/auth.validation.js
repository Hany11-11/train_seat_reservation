import ApiError from "../utils/apiError.js";

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isStrongEnoughPassword = (value) =>
  typeof value === "string" && value.length >= 6;

export const validateLoginInput = (payload) => {
  const { email, password } = payload || {};

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (!isEmail(email)) {
    throw new ApiError(400, "Email format is invalid");
  }

  if (!isStrongEnoughPassword(password)) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
};

export const validateRegisterInput = (payload) => {
  const { nic, name, email, mobile, password } = payload || {};

  if (!nic || !name || !email || !mobile || !password) {
    throw new ApiError(
      400,
      "NIC, name, email, mobile and password are required",
    );
  }

  if (nic.trim().length < 6) {
    throw new ApiError(400, "NIC must be at least 6 characters");
  }

  if (name.trim().length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters");
  }

  if (!isEmail(email)) {
    throw new ApiError(400, "Email format is invalid");
  }

  if (mobile.trim().length < 7) {
    throw new ApiError(400, "Mobile number is invalid");
  }

  if (!isStrongEnoughPassword(password)) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
};
