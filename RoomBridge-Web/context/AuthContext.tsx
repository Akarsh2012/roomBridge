"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  login as loginApi,
  register as registerApi,
  getMe,
  logout as logoutApi,
  User,
  LoginPayload,
  RegisterPayload,
} from "@/services/auth";
import Loader from "@/components/common/Loader";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // On mount, check if user is already logged in
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Race against a 3s timeout — don't hang if backend is down
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 3000)
        );
        const userData = await Promise.race([getMe(), timeoutPromise]);
        setUser(userData);
      } catch {
        // Token invalid, expired, or backend unreachable — clear storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Minimum loader display time so it doesn't flash
  const withMinDelay = async <T,>(fn: () => Promise<T>): Promise<T> => {
    setIsActionLoading(true);
    const start = Date.now();
    try {
      const result = await fn();
      const elapsed = Date.now() - start;
      if (elapsed < 800) {
        await new Promise((r) => setTimeout(r, 800 - elapsed));
      }
      return result;
    } finally {
      setIsActionLoading(false);
    }
  };

  const login = async (payload: LoginPayload): Promise<User> => {
    return withMinDelay(async () => {
      const data = await loginApi(payload);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    });
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    return withMinDelay(async () => {
      const data = await registerApi(payload);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    });
  };

  const logout = async () => {
    await withMinDelay(async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          await logoutApi(refreshToken);
        }
      } catch {
        // Ignore logout errors
      } finally {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {isActionLoading && <Loader />}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
