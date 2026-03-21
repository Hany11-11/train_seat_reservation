import { useState, useEffect, useCallback } from "react";
import { User, AuthState } from "@/types/user";
import { authService, getToken, removeToken } from "@/services/authService";

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const user = authService.getMe();
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
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    (
      email: string,
      password: string,
    ): { success: boolean; error?: string } => {
      try {
        const { user } = authService.login(email, password);
        setAuthState({
          user,
          isAuthenticated: true,
          isAdmin: user.role === "admin",
        });
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || "Login failed" };
      }
    },
    [],
  );

  const adminLogin = useCallback(
    (
      email: string,
      password: string,
    ): { success: boolean; error?: string } => {
      try {
        const { user } = authService.login(email, password);

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
      } catch (error: any) {
        return { success: false, error: error.message || "Login failed" };
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
    (data: {
      nic: string;
      name: string;
      email: string;
      mobile: string;
      password: string;
    }): { success: boolean; error?: string; user?: User } => {
      try {
        const { user } = authService.register(data);
        setAuthState({
          user,
          isAuthenticated: true,
          isAdmin: false,
        });
        return { success: true, user };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || "Registration failed",
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