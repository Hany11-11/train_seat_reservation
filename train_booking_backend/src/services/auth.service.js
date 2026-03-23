import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/apiError.js";
import { AUTH_MESSAGES, USER_ROLES } from "../constants/auth.constants.js";
import { toPublicUser } from "../utils/user.mapper.js";

const buildToken = (user) => {
  const secret = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ sub: user._id.toString(), role: user.role }, secret, {
    expiresIn,
  });
};

const register = async ({
  nic,
  name,
  email,
  mobile,
  password,
  role = USER_ROLES.USER,
}) => {
  const normalizedEmail = email.toLowerCase();

  const [existingEmail, existingNic] = await Promise.all([
    userRepository.findByEmail(normalizedEmail),
    userRepository.findByNic(nic),
  ]);

  if (existingEmail) {
    throw new ApiError(409, AUTH_MESSAGES.EMAIL_EXISTS);
  }

  if (existingNic) {
    throw new ApiError(409, AUTH_MESSAGES.NIC_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await userRepository.create({
    nic,
    name,
    email: normalizedEmail,
    mobile,
    password: hashedPassword,
    role,
  });

  return {
    user: toPublicUser(createdUser),
    token: buildToken(createdUser),
    message: AUTH_MESSAGES.REGISTER_SUCCESS,
  };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await userRepository.findByEmail(normalizedEmail, true);

  if (!user) {
    throw new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  const isBcryptHash =
    typeof user.password === "string" &&
    /^\$2[aby]\$\d{2}\$/.test(user.password);

  let isValidPassword = false;

  if (isBcryptHash) {
    isValidPassword = await bcrypt.compare(password, user.password);
  } else {
    isValidPassword = password === user.password;

    if (isValidPassword) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await userRepository.updateById(user._id, { password: hashedPassword });
    }
  }

  if (!isValidPassword) {
    throw new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  return {
    user: toPublicUser(user),
    token: buildToken(user),
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
  };
};

const getMe = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new ApiError(401, AUTH_MESSAGES.UNAUTHORIZED);
  }

  return toPublicUser(user);
};

const findByNic = async (nic) => {
  const user = await userRepository.findByNic(nic);
  return user ? toPublicUser(user) : null;
};

export default {
  register,
  login,
  getMe,
  findByNic,
};
