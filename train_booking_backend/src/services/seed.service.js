import bcrypt from "bcryptjs";

import userRepository from "../repositories/user.repository.js";
import { USER_ROLES } from "../constants/auth.constants.js";

const demoUsers = [
  {
    nic: "199012345678",
    name: "John Perera",
    email: "john@example.com",
    mobile: "0771234567",
    password: "password123",
    role: USER_ROLES.USER,
  },
  {
    nic: "198523456789",
    name: "Sarah Fernando",
    email: "sarah@example.com",
    mobile: "0772345678",
    password: "password123",
    role: USER_ROLES.USER,
  },
  {
    nic: "198012345678",
    name: "Admin User",
    email: "admin@railway.lk",
    mobile: "0770000000",
    password: "admin123",
    role: USER_ROLES.ADMIN,
  },
];

export const seedDemoUsers = async () => {
  for (const user of demoUsers) {
    const existing = await userRepository.findByEmail(user.email);

    if (existing) {
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);
    await userRepository.create({
      nic: user.nic,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      password: hashedPassword,
      role: user.role,
    });
  }
};
