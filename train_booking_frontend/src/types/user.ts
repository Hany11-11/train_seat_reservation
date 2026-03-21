export interface User {
  id: string;
  nic: string;
  name: string;
  email: string;
  mobile: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nic: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
}
