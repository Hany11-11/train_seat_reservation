import { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: 'u1',
    nic: '199012345678',
    name: 'John Perera',
    email: 'john@example.com',
    mobile: '0771234567',
    role: 'user',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'u2',
    nic: '198523456789',
    name: 'Sarah Fernando',
    email: 'sarah@example.com',
    mobile: '0772345678',
    role: 'user',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'admin1',
    nic: '198012345678',
    name: 'Admin User',
    email: 'admin@railway.lk',
    mobile: '0770000000',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockPasswords: Record<string, string> = {
  'john@example.com': 'password123',
  'sarah@example.com': 'password123',
  'admin@railway.lk': 'admin123',
};

export const getUsersFromStorage = (): User[] => {
  const stored = localStorage.getItem('users');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('users', JSON.stringify(mockUsers));
  return mockUsers;
};

export const saveUsersToStorage = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const getPasswordsFromStorage = (): Record<string, string> => {
  const stored = localStorage.getItem('passwords');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('passwords', JSON.stringify(mockPasswords));
  return mockPasswords;
};

export const savePasswordsToStorage = (passwords: Record<string, string>): void => {
  localStorage.setItem('passwords', JSON.stringify(passwords));
};

export const findUserByNIC = (nic: string): User | undefined => {
  const users = getUsersFromStorage();
  return users.find(u => u.nic === nic);
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsersFromStorage();
  return users.find(u => u.email === email);
};
