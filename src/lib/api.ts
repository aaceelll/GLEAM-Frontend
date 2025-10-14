import axios, { AxiosHeaders } from "axios";
import type { ApiRegisterRequest } from "@/types";

// Base URL API Laravel
const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, ""); // buang trailing slash
console.log("[API_BASE_URL]", API_BASE_URL);

// ===== Helpers (aman untuk SSR) =====
const isBrowser = () => typeof window !== "undefined";

const LS_TOKEN_KEY = "gleam_token";
const COOKIE_TOKEN_KEY = "auth_token";

export const getToken = (): string => {
  if (!isBrowser()) return "";
  return window.localStorage.getItem(LS_TOKEN_KEY) || "";
};
export const setToken = (t: string) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(LS_TOKEN_KEY, t);
};
export const clearToken = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(LS_TOKEN_KEY);
};

const getCookieToken = (): string => {
  if (!isBrowser()) return "";
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_TOKEN_KEY}=([^;]*)`)
  );
  return m ? decodeURIComponent(m[1]) : "";
};

export const setTokenCookie = (t: string) => {
  if (!isBrowser()) return;
  document.cookie = `${COOKIE_TOKEN_KEY}=${t}; Path=/; Max-Age=${
    60 * 60 * 24 * 7
  }; SameSite=Lax`;
};
export const clearTokenCookie = () => {
  if (!isBrowser()) return;
  document.cookie = `${COOKIE_TOKEN_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
};

// ===== Axios instance =====
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // pakai Bearer token
});

// Sisipkan Authorization Bearer ke setiap request
api.interceptors.request.use((config) => {
  const token = getToken() || getCookieToken();
  if (token) {
    const headers = (config.headers ??= new AxiosHeaders());
    (headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Logging error + auto-logout bila 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = err?.response?.config?.url;
    const data = err?.response?.data;
    console.error("API ERROR", status, url, data);

    if (status === 401) {
      clearToken();
      clearTokenCookie();
      if (isBrowser()) window.location.href = "/login/user";
    }
    return Promise.reject(err);
  }
);

// ========================
// Auth API
// ========================
export const authAPI = {
  registerUser: (data: ApiRegisterRequest) =>
    api.post("/auth/register/user", data),
  login: (data: { login: string; password: string }) =>
    api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

// ========================
// User Management API (Admin)
// ========================
export const usersAPI = {
  list: () => api.get("/admin/users").then((r) => r.data),
  create: (payload: {
    nama: string;
    username: string;
    email: string;
    nomor_telepon?: string;
    password: string;
    role: "admin" | "manajemen" | "nakes" | "user";
  }) => api.post("/admin/users", payload).then((r) => r.data),
  show: (id: number) => api.get(`/admin/users/${id}`).then((r) => r.data),
  update: (id: number, payload: any) =>
    api.put(`/admin/users/${id}`, payload).then((r) => r.data),
  delete: (id: number) => api.delete(`/admin/users/${id}`).then((r) => r.data),
};

export default api;
