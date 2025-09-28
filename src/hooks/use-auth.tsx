// src/hooks/use-auth.tsx
"use client";

import {
  createContext, useContext, useEffect, useState, type ReactNode,
} from "react";
import { authAPI, getToken, setToken, clearToken, setTokenCookie, clearTokenCookie } from "@/lib/api";
import type {
  AuthResponse,
  RegisterFormData,
  ApiRegisterRequest,
  User,
} from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: { email: string; password: string }) => Promise<User>;
  register: (data: RegisterFormData) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    (async () => {
      try {
        const res = await authAPI.me();
        setUser(res.data as User);
      } catch {
        clearToken();
        clearTokenCookie();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const res = await authAPI.login(data);
    const { token, user } = res.data as AuthResponse;

    // save to localStorage (for axios) and cookie (for middleware)
    setToken(token);
    setTokenCookie(token);

    // (optional) keep user in LS for quick role checks in layout
    localStorage.setItem("user_data", JSON.stringify(user));

    setUser(user);
    return user;
  };

  const register = async (data: RegisterFormData): Promise<AuthResponse> => {
    const username =
      data.username?.trim() ||
      (data.email.includes("@")
        ? data.email.split("@")[0]
        : data.name.replace(/\s+/g, "").toLowerCase());

    const payload: ApiRegisterRequest = {
      nama: data.name,
      email: data.email,
      username,
      nomor_telepon: data.phone,
      tanggal_lahir: data.date_of_birth,
      jenis_kelamin: data.gender,
      alamat: data.address,
      password: data.password,
      password_confirmation: data.password_confirmation,
    };

    const res = await authAPI.registerUser(payload);
    return res.data as AuthResponse;
  };

  const logout = () => {
    authAPI.logout().finally(() => {
      clearToken();
      clearTokenCookie();
      setUser(null);
      if (typeof window !== "undefined") window.location.href = "/login/user";
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
