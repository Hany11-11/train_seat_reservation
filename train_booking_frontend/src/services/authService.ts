import { User } from "@/types/user";

const TOKEN_KEY = "auth_token";
const CURRENT_USER_KEY = "current_user";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type AuthPayload = {
  user: User;
  token: string;
};

type MePayload = {
  user: User;
};

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

const apiRequest = async <T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const rawBody = await response.text();
  const parsedBody = rawBody ? JSON.parse(rawBody) : null;

  if (!response.ok) {
    const message = parsedBody?.message || "Request failed";
    throw new Error(message);
  }

  return parsedBody as T;
};

export const authService = {
  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const response = await apiRequest<ApiResponse<AuthPayload>>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const { user, token } = response.data;
    saveToken(token);
    saveCurrentUser(user);

    return { user, token };
  },

  async register(payload: {
    nic: string;
    name: string;
    email: string;
    mobile: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    const response = await apiRequest<ApiResponse<AuthPayload>>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    const { user, token } = response.data;
    saveToken(token);
    saveCurrentUser(user);

    return { user, token };
  },

  async getMe(): Promise<User> {
    const token = getToken();

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await apiRequest<ApiResponse<MePayload>>("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = response.data.user;
    saveCurrentUser(user);

    return user;
  },

  async findByNic(nic: string): Promise<{ exists: boolean; user?: User }> {
    const response = await apiRequest<{ success: boolean; exists: boolean; data?: { user: User } }>(
      `/auth/users/nic/${encodeURIComponent(nic)}`,
      { method: "GET" }
    );
    return {
      exists: response.exists,
      user: response.data?.user,
    };
  },

  logout() {
    removeToken();
  },

  getStoredUser() {
    return getCurrentUser();
  },
};
