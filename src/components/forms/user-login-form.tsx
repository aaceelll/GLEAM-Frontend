// src/components/forms/user-login-form.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface LoginData {
  login: string;
  password: string;
}

/* =============== Centered Modal =============== */
type ModalKind = "success" | "error";
interface ModalState {
  open: boolean;
  kind: ModalKind;
  title: string;
  message?: string;
  ctaLabel: string;
  onCta: () => void;
}

const CenterModal: React.FC<{
  state: ModalState;
  autoCloseMs?: number;
  onClose?: () => void;
}> = ({ state, autoCloseMs = 0, onClose }) => {
  if (!state.open) return null;

  useEffect(() => {
    if (!state.open || !autoCloseMs) return;
    const t = setTimeout(() => (onClose ?? state.onCta)(), autoCloseMs);
    return () => clearTimeout(t);
  }, [state.open, autoCloseMs, onClose, state]);

  const icon =
    state.kind === "success" ? (
      <CheckCircle2 className="w-6 h-6 text-white" />
    ) : (
      <AlertCircle className="w-6 h-6 text-white" />
    );

  return (
    // ✅ BACKDROP TANPA onClick - TIDAK BISA DI-KLIK UNTUK CLOSE
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop hitam - TANPA onClick */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal content */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-white to-gray-50 border-2 border-emerald-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header gradient hijau */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{state.title}</h3>
              {state.message && (
                <p className="mt-1.5 text-sm text-white/90 leading-relaxed">
                  {state.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer tombol */}
        <div className="p-6">
          <button
            onClick={state.onCta}
            className="w-full h-12 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            {state.ctaLabel}
          </button>
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

  // Modal state
  const [modal, setModal] = useState<ModalState>({
    open: false,
    kind: "success",
    title: "",
    message: "",
    ctaLabel: "OK",
    onCta: () => setModal((s) => ({ ...s, open: false })),
  });

  // kunci scroll saat modal
  useEffect(() => {
    if (!modal.open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [modal.open]);

  // tangkap window.alert -> ganti modal hijau
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (msg?: any) => {
      setModal({
        open: true,
        kind: "error",
        title: "Login Gagal",
        message: String(msg ?? ""),
        ctaLabel: "Tutup",
        onCta: () => setModal((s) => ({ ...s, open: false })),
      });
    };
    return () => { window.alert = originalAlert; };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.login.trim()) newErrors.login = "Email/Username wajib diisi";
    else if (formData.login.includes("@") && !emailRegex.test(formData.login))
      newErrors.login = "Format email tidak valid";
    if (!formData.password) newErrors.password = "Password wajib diisi";
    return newErrors;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setModal({
        open: true,
        kind: "error",
        title: "Data Tidak Lengkap",
        message: "Mohon lengkapi semua kolom yang bertanda merah.",
        ctaLabel: "Tutup",
        onCta: () => setModal((s) => ({ ...s, open: false })),
      });
      return;
    }

    try {
      setLoading(true);
      const user = await login(formData);

      const role = user.role as string;
      if (role === "super_admin" || role === "admin") router.replace("/dashboard/admin");
      else if (role === "manajemen") router.replace("/dashboard/manajemen");
      else if (role === "nakes") router.replace("/dashboard/nakes");
      else router.replace("/dashboard/user");
      
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        "Email/Username atau password salah. Silakan coba lagi.";

      // Modal error - HANYA bisa ditutup dengan klik tombol "Tutup"
      setModal({
        open: true,
        kind: "error",
        title: "Login Gagal",
        message: msg,
        ctaLabel: "Tutup",
        onCta: () => setModal((s) => ({ ...s, open: false })),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Modal - TIDAK auto-close */}
      <CenterModal
        state={modal}
        autoCloseMs={0}
      />

      {/* Card + Form */}
      <div className="w-full max-w-md mx-auto py-12">
        <div className="relative overflow-hidden bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-white/60 p-8 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:to-emerald-50/40 before:rounded-3xl before:pointer-events-none">
          <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-400/30 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-gradient-to-tr from-teal-400/30 to-emerald-400/30 blur-2xl" />
          <div className="pointer-events-none absolute inset-3 rounded-2xl ring-1 ring-inset ring-emerald-200/30" />

          <form onSubmit={onSubmit} className="relative z-10 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-300/50 rotate-3 hover:rotate-0 transition-transform duration-300 ring-4 ring-white/50">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  Selamat Datang Kembali!
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Masuk untuk melanjutkan perjalanan sehatmu
                </p>
              </div>
            </div>

            {/* Email/Username */}
            <div className="space-y-2">
              <label htmlFor="login" className="block text-sm font-semibold text-gray-700">
                Email atau Username
              </label>
              <input
                id="login"
                name="login"
                type="text"
                value={formData.login}
                onChange={handleInputChange}
                placeholder="Masukkan email atau username"
                className={`w-full h-12 px-4 rounded-xl border-2 transition-all outline-none ${
                  errors.login
                    ? "border-red-400 bg-red-50 focus:border-red-500"
                    : "border-gray-200 bg-white/90 focus:border-emerald-400 focus:bg-white"
                }`}
              />
              {errors.login && (
                <p className="text-sm text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {errors.login}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan password"
                  className={`w-full h-12 px-4 pr-12 rounded-xl border-2 transition-all outline-none ${
                    errors.password
                      ? "border-red-400 bg-red-50 focus:border-red-500"
                      : "border-gray-200 bg-white/90 focus:border-emerald-400 focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
              >
                Lupa password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-13 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-300/50 hover:shadow-emerald-400/60 hover:shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] py-3"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Memproses..." : "Masuk"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </button>

            {/* Register Link */}
            <div className="pt-4 border-t-2 border-emerald-100/50 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link
                  href="/register/user"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
