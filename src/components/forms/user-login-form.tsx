"use client";

import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Sparkles, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface LoginData {
  login: string;
  password: string;
}

/* ===================== Themed Toast (long + pause) ===================== */
const ThemedToast: React.FC<{
  open: boolean;
  kind?: "error" | "success" | "info";
  message: string;
  onClose: () => void;
  duration?: number; // ms
}> = ({ open, kind = "error", message, onClose, duration = 8000 }) => {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const palette = {
    error: {
      ring: "ring-rose-300/70",
      bg: "from-white/85 to-rose-50/60",
      bar: "from-rose-500 to-rose-600",
      text: "text-rose-700",
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
    },
    success: {
      ring: "ring-emerald-300/70",
      bg: "from-white/85 to-emerald-50/60",
      bar: "from-emerald-500 to-teal-600",
      text: "text-emerald-700",
      icon: <AlertTriangle className="w-5 h-5 text-emerald-600" />,
    },
    info: {
      ring: "ring-cyan-300/70",
      bg: "from-white/85 to-cyan-50/60",
      bar: "from-teal-500 to-cyan-600",
      text: "text-teal-700",
      icon: <AlertTriangle className="w-5 h-5 text-teal-600" />,
    },
  }[kind];

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    timerRef.current = null;
    rafRef.current = null;
  };

  const start = () => {
    clearTimers();
    setRunning(true);
    startTimeRef.current = performance.now();
    timerRef.current = window.setTimeout(onClose, remaining);
    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current;
      setRemaining((prev) => Math.max(0, prev - elapsed));
      startTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const pause = () => {
    if (!running) return;
    setRunning(false);
    clearTimers();
  };

  useEffect(() => {
    if (open) {
      setRemaining(duration);
      start();
    } else {
      clearTimers();
    }
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, duration]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const progress = Math.max(0, Math.min(100, ((duration - remaining) / duration) * 100));

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 z-[999] pointer-events-none flex items-start justify-end p-4 sm:p-6"
    >
      <div className="pointer-events-auto w-full max-w-sm select-none">
        <div
          className={`relative overflow-hidden rounded-2xl shadow-2xl ring-1 ${palette.ring} backdrop-blur-md`}
          onMouseEnter={pause}
          onMouseLeave={start}
        >
          <div className={`h-1 w-full bg-gradient-to-r ${palette.bar}`} />
          <div className={`bg-gradient-to-br ${palette.bg} p-4`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">{palette.icon}</div>
              <p className={`text-sm font-medium leading-6 ${palette.text}`}>
                {message}
              </p>
              <button
                onClick={onClose}
                className="ml-auto rounded-md p-1.5 text-gray-500/90 hover:text-gray-700 hover:bg-white/60 transition"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200/30 rounded-b-2xl overflow-hidden">
            <div
              className={`h-1 bg-gradient-to-r ${palette.bar} transition-all duration-100 ease-linear`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
/* ====================================================================== */

export const UserLoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<LoginData>({ login: "", password: "" });

  const [toast, setToast] = useState({ open: false, message: "" });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.login.trim()) newErrors.login = "Email/Username wajib diisi";
    else if (formData.login.includes("@") && !emailRegex.test(formData.login))
      newErrors.login = "Format email tidak valid";
    if (!formData.password) newErrors.password = "Password wajib diisi";
    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setToast({ open: true, message: "Mohon lengkapi kolom yang wajib diisi." });
      return;
    }
    try {
      setLoading(true);
      await login(formData);
      router.replace("/dashboard/user");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Email/Username atau password salah.";
      setToast({ open: true, message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThemedToast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast({ open: false, message: "" })}
        kind="error"
        duration={8000}
      />

      <div className="w-full max-w-md mx-auto py-12">
        <div className="relative overflow-hidden bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-white/60 p-8 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:to-emerald-50/40 before:rounded-3xl before:pointer-events-none">
          <form onSubmit={onSubmit} className="relative z-10 space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-300/50 rotate-3 hover:rotate-0 transition-transform duration-300 ring-4 ring-white/50">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Selamat Datang Kembali!
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Masuk ke akun Anda untuk melanjutkan monitoring kesehatan
              </p>
            </div>

            {/* Input */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-emerald-800">
                  Email atau Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm ${
                    errors.login
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                      : "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                  }`}
                  placeholder="Masukkan email atau username"
                />
                {errors.login && (
                  <p className="text-xs text-rose-600 font-medium mt-1">
                    {errors.login}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm ${
                      errors.password
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                        : "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                    }`}
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-600 font-medium mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Lupa password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-300/50 hover:shadow-emerald-400/60 transition-all disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Masuk Sekarang"}
              </button>
            </div>

            <div className="pt-4 border-t-2 border-emerald-100/50 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link
                  href="/register/user"
                  className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
