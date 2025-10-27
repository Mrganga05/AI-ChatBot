// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authAPI } from "../services/api";

interface User { id?: number; email?: string; username?: string; }
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void; // Logout function should be synchronous in context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);
      try {
        const res = await authAPI.verifyToken();
        if (res.valid) setUser(res.user);
        else localStorage.removeItem("token");
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    localStorage.setItem("token", res.token);
    setUser(res.user);
  };

  const register = async (email: string, username: string, password: string) => {
    const res = await authAPI.register(email, username, password);
    localStorage.setItem("token", res.token);
    setUser(res.user);
  };

  // 🚨 UPDATED LOGOUT: Calls the API, then cleans up locally.
  // We keep it synchronous/non-async here so the component can handle the navigation
  const logout = useCallback(() => {
    // Optional: Call the backend logout API here if needed (e.g., to invalidate token server-side)
    // The main API interceptor already handles token removal/redirect on 401,
    // so here we just ensure local cleanup.
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};