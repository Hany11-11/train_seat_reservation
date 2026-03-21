import { User } from "@/types/user";
import { getUsersFromStorage } from "@/data/users.mock";

const saveUsersToStorage = (users: User[]): void => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const userService = {
  getAllUsers(): User[] {
    return getUsersFromStorage();
  },

  getUserById(id: string): User {
    const users = getUsersFromStorage();
    const user = users.find((u) => u.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  updateProfile(data: Partial<User>): User {
    const currentUser = localStorage.getItem("current_user");
    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    const user = JSON.parse(currentUser);
    const users = getUsersFromStorage();
    const index = users.findIndex((u) => u.id === user.id);

    if (index === -1) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...users[index],
      ...data,
      id: user.id,
      updatedAt: new Date().toISOString(),
    };

    users[index] = updatedUser;
    saveUsersToStorage(users);
    localStorage.setItem("current_user", JSON.stringify(updatedUser));

    return updatedUser;
  },

  toggleUserStatus(id: string): User {
    const users = getUsersFromStorage();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      throw new Error("User not found");
    }

    const isActive = (users[index] as any).isActive ?? true;
    (users[index] as any).isActive = !isActive;
    users[index].updatedAt = new Date().toISOString();

    saveUsersToStorage(users);

    return users[index];
  },

  deleteUser(id: string): void {
    const users = getUsersFromStorage();
    const filtered = users.filter((u) => u.id !== id);

    if (filtered.length === users.length) {
      throw new Error("User not found");
    }

    saveUsersToStorage(filtered);
  },
};