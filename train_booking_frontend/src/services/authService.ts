import { User } from "@/types/user";
import {
  getUsersFromStorage,
  mockPasswords,
  getPasswordsFromStorage,
  savePasswordsToStorage,
  saveUsersToStorage,
} from "@/data/users.mock";

const TOKEN_KEY = "auth_token";
const CURRENT_USER_KEY = "current_user";

export const saveToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};

const saveCurrentUser = (user: User) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const authService = {
  login(
    email: string,
    password: string,
  ): { user: User; token: string } {
    const users = getUsersFromStorage();
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwords = getPasswordsFromStorage();
    const expectedPassword = passwords[email];
    if (expectedPassword !== password) {
      throw new Error("Invalid email or password");
    }

    const token = `mock-token-${user.id}-${Date.now()}`;
    saveToken(token);
    saveCurrentUser(user);

    return { user, token };
  },

  register(payload: {
    nic: string;
    name: string;
    email: string;
    mobile: string;
    password: string;
  }): { user: User; token: string } {
    const users = getUsersFromStorage();

    if (users.find((u) => u.email === payload.email)) {
      throw new Error("Email already registered");
    }

    if (users.find((u) => u.nic === payload.nic)) {
      throw new Error("NIC already registered");
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      nic: payload.nic,
      name: payload.name,
      email: payload.email,
      mobile: payload.mobile,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsersToStorage(users);

    const passwords = getPasswordsFromStorage();
    passwords[payload.email] = payload.password;
    savePasswordsToStorage(passwords);

    const token = `mock-token-${newUser.id}-${Date.now()}`;
    saveToken(token);
    saveCurrentUser(newUser);

    return { user: newUser, token };
  },

  getMe(): User {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    return user;
  },

  logout() {
    removeToken();
  },
};