import { useState, useEffect, useCallback } from "react";
import { User, AuthState } from "@/types/user";
import { authService, getToken, removeToken } from "@/services/authService";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const useAuth = () => {
  const token = getToken();
  const storedUser = authService.getStoredUser();

  const [authState, setAuthState] = useState<AuthState>({
    user: token ? storedUser : null,
    isAuthenticated: Boolean(token && storedUser),
    isAdmin: Boolean(token && storedUser?.role === "admin"),
  });
  const [isLoading, setIsLoading] = useState(Boolean(token));

  const checkAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const user = await authService.getMe();
      setAuthState({
        user,
        isAuthenticated: true,
        isAdmin: user.role === "admin",
      });
    } catch (error) {
      removeToken();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const { user } = await authService.login(email, password);

        if (user.role === "admin") {
          authService.logout();
          return {
            success: false,
            error: "Admin account detected. Please use the admin login page.",
          };
        }

        setAuthState({
          user,
          isAuthenticated: true,
          isAdmin: false,
        });
        return { success: true };
      } catch (error: unknown) {
        return {
          success: false,
          error: getErrorMessage(error, "Login failed"),
        };
      }
    },
    [],
  );

  const adminLogin = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const { user } = await authService.login(email, password);

        if (user.role !== "admin") {
          authService.logout();
          return {
            success: false,
            error: "Access denied. Admin privileges required.",
          };
        }

        setAuthState({
          user,
          isAuthenticated: true,
          isAdmin: true,
        });
        return { success: true };
      } catch (error: unknown) {
        return {
          success: false,
          error: getErrorMessage(error, "Login failed"),
        };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  }, []);

  const register = useCallback(
    async (data: {
      nic: string;
      name: string;
      email: string;
      mobile: string;
      password: string;
    }): Promise<{ success: boolean; error?: string; user?: User }> => {
      try {
        const { user } = await authService.register(data);
        setAuthState({
          user,
          isAuthenticated: true,
          isAdmin: false,
        });
        return { success: true, user };
      } catch (error: unknown) {
        return {
          success: false,
          error: getErrorMessage(error, "Registration failed"),
        };
      }
    },
    [],
  );

  return {
    ...authState,
    isLoading,
    login,
    adminLogin,
    logout,
    register,
  };
};
