"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  authAPI,
  getToken,
  setToken,
  clearToken,
  setTokenCookie,
  clearTokenCookie,
} from "@/lib/api";
import type {
  AuthResponse,
  RegisterFormData,
  ApiRegisterRequest,
  User,
} from "@/types";

const setRoleCookie = (role: string) => {
  if (typeof window === "undefined") return;
  const cookie = `role=${encodeURIComponent(role)}; Path=/; Max-Age=${60*60*24*7}; SameSite=Lax`;
  document.cookie = cookie;
  console.log("✅ Cookie role SET:", role);
};

const clearRoleCookie = () => {
  if (typeof window === "undefined") return;
  document.cookie = "role=; Path=/; Max-Age=0; SameSite=Lax";
  console.log("🗑️ Cookie role CLEARED");
};

const setUserNameCookie = (nama: string) => {
  if (typeof window === "undefined") return;
  const cookie = `user_nama=${encodeURIComponent(nama)}; Path=/; Max-Age=${60*60*24*7}; SameSite=Lax`;
  document.cookie = cookie;
  console.log("✅ Cookie user_nama SET:", nama);
};

const clearUserNameCookie = () => {
  if (typeof window === "undefined") return;
  document.cookie = "user_nama=; Path=/; Max-Age=0; SameSite=Lax";
  console.log("🗑️ Cookie user_nama CLEARED");
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (u: User | null) => void;
  login: (data: { login: string; password: string }) => Promise<User>;
  register: (data: RegisterFormData) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setUser = (u: User | null) => {
    setUserState(u);
    if (typeof window !== "undefined") {
      if (u) {
        localStorage.setItem("user_data", JSON.stringify(u));
        setUserNameCookie(u.nama || u.username || "User");
        setRoleCookie(u.role);
        console.log("👤 User data saved:", { nama: u.nama, role: u.role });
      } else {
        localStorage.removeItem("user_data");
        clearUserNameCookie();
        clearRoleCookie();
      }
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await authAPI.me();
        console.log("🔄 API /me response:", res.data);
        
        // Backend mengembalikan { success: true, user: {...} }
        const userData = (res.data as any).user || res.data;
        console.log("🔄 Extracted user data:", userData);
        
        setUser(userData as User);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        clearToken();
        clearTokenCookie();
        clearRoleCookie();
        clearUserNameCookie();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (data: { login: string; password: string }) => {
    const res = await authAPI.login(data);
    console.log("🔐 Login response:", res.data);
    
    // Backend mengembalikan { success: true, user: {...}, token: "..." }
    const responseData = res.data as any;
    const token = responseData.token;
    const user = responseData.user;

    console.log("🔐 Extracted:", { user, token: token?.substring(0, 20) + "..." });

    setToken(token);
    setTokenCookie(token);
    setRoleCookie(user.role);
    setUserNameCookie(user.nama || user.username || "User");
    setUser(user);

    // Verify cookies after setting
    console.log("🍪 Cookies after login:", {
      role: getCookie("role"),
      user_nama: getCookie("user_nama"),
    });

    return user;
  };

  const register = async (data: RegisterFormData): Promise<AuthResponse> => {
    const username =
      data.username?.trim() ||
      (data.email.includes("@")
        ? data.email.split("@")[0]
        : data.name.replace(/\s+/g, "").toLowerCase());

    const apiData: ApiRegisterRequest = {
      nama: data.name,
      email: data.email,
      username,
      nomor_telepon: data.phone,
      tanggal_lahir: data.date_of_birth,
      jenis_kelamin: data.gender,
      alamat: data.address,
      password: data.password,
      password_confirmation: data.password_confirmation
    };

    const res = await authAPI.registerUser(apiData);
    const responseData = res.data as any;
    
    const authRes: AuthResponse = {
      token: responseData.token,
      user: responseData.user
    };

    if (authRes.token && authRes.user) {
      setToken(authRes.token);
      setTokenCookie(authRes.token);
      setRoleCookie(authRes.user.role);
      setUserNameCookie(authRes.user.nama || authRes.user.username || "User");
      setUser(authRes.user);
    }

    return authRes;
  };

  const logout = () => {
    clearToken();
    clearTokenCookie();
    clearRoleCookie();
    clearUserNameCookie();
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_data");
      document.cookie = "just_logged_out=1; Path=/; Max-Age=60; SameSite=Lax";
      // window.location.href = "/login";
      window.location.replace("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        setUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}