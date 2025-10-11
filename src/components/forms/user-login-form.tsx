// src/components/forms/user-login-form.tsx
"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface LoginData {
  login: string; // email atau username
  password: string;
}

export const UserLoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<LoginData>({ login: "", password: "" });

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

  const handleLogin = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await login(formData);
      router.replace("/dashboard/user");
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        "Login gagal";
      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-emerald-200 via-teal-200 to-cyan-200">
      {/* ====== Background Layer ====== */}
      
      {/* Large animated gradient orbs - full color coverage */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -top-20 -left-20 h-[50rem] w-[50rem] rounded-full bg-gradient-to-br from-emerald-300 via-teal-300 to-cyan-300 opacity-60 blur-3xl animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-32 -right-32 h-[50rem] w-[50rem] rounded-full bg-gradient-to-tr from-teal-200 via-emerald-300 to-lime-200 opacity-60 blur-3xl animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-100 via-teal-200 to-cyan-200 opacity-60 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 h-[30rem] w-[30rem] rounded-full bg-gradient-to-bl from-cyan-200 via-teal-200 to-emerald-200 opacity-50 blur-3xl animate-pulse"
             style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 left-1/3 h-[35rem] w-[35rem] rounded-full bg-gradient-to-tr from-lime-200 via-emerald-200 to-teal-200 opacity-55 blur-3xl animate-pulse"
             style={{ animationDuration: '9s', animationDelay: '3s' }} />
      </div>

      {/* Geometric pattern overlay - more visible */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.25]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Hexagon pattern */}
            <pattern id="hexPattern" x="0" y="0" width="80" height="69.28" patternUnits="userSpaceOnUse">
              <path d="M20,0 L60,0 L80,34.64 L60,69.28 L20,69.28 L0,34.64 Z" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    className="text-emerald-500/40" />
            </pattern>
            
            {/* Gradient mask */}
            <radialGradient id="hexMask">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="60%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0.1" />
            </radialGradient>
            <mask id="hexMaskEl">
              <rect width="100%" height="100%" fill="url(#hexMask)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexPattern)" mask="url(#hexMaskEl)" />
        </svg>
      </div>

      {/* Dot grid pattern - more visible */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.3]">
        <svg className="h-full w-full text-emerald-600/30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotgrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            </pattern>
            <radialGradient id="dotFade">
              <stop offset="30%" stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </radialGradient>
            <mask id="dotMask">
              <rect width="100%" height="100%" fill="url(#dotFade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotgrid)" mask="url(#dotMask)" />
        </svg>
      </div>

      {/* Subtle line pattern - more emerald toned */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0,20 L40,20" stroke="currentColor" strokeWidth="0.8" className="text-emerald-600" />
              <path d="M20,0 L20,40" stroke="currentColor" strokeWidth="0.8" className="text-emerald-600" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)" opacity="0.6" />
        </svg>
      </div>

      {/* Noise texture */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* Vignette effect - emerald toned */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0)_0%,rgba(16,185,129,0)_50%,rgba(5,150,105,0.15)_100%)]" />

      {/* Decorative corner elements - bigger and more visible */}
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 -z-10">
        <div className="absolute top-8 left-8 w-48 h-48 border-[3px] border-emerald-400/40 rounded-[2.5rem] rotate-12" />
        <div className="absolute top-16 left-16 w-36 h-36 border-[2px] border-teal-400/30 rounded-3xl -rotate-6" />
        <div className="absolute top-24 left-24 w-24 h-24 border-[2px] border-emerald-300/25 rounded-2xl rotate-12" />
      </div>
      
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 -z-10">
        <div className="absolute bottom-8 right-8 w-48 h-48 border-[3px] border-emerald-400/40 rounded-[2.5rem] -rotate-12" />
        <div className="absolute bottom-16 right-16 w-36 h-36 border-[2px] border-teal-400/30 rounded-3xl rotate-6" />
        <div className="absolute bottom-24 right-24 w-24 h-24 border-[2px] border-emerald-300/25 rounded-2xl -rotate-12" />
      </div>

      {/* Floating particles - more visible and numerous */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-emerald-400/50 rounded-full animate-ping" 
             style={{ animationDuration: '3s', animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-teal-400/50 rounded-full animate-ping" 
             style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-cyan-400/50 rounded-full animate-ping" 
             style={{ animationDuration: '5s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-emerald-500/40 rounded-full animate-ping" 
             style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 bg-teal-500/40 rounded-full animate-ping" 
             style={{ animationDuration: '3.5s', animationDelay: '1.5s' }} />
        <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-cyan-500/40 rounded-full animate-ping" 
             style={{ animationDuration: '4.2s', animationDelay: '2.5s' }} />
      </div>

      {/* ====== Centered Card ====== */}
      <div className="relative z-10 w-full flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Glass morphism card */}
          <div className="relative overflow-hidden bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-white/60 p-8 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:to-emerald-50/40 before:rounded-3xl before:pointer-events-none">
            
            {/* Top glow line */}
            <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            
            {/* Corner accent lights */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-400/30 blur-2xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-gradient-to-tr from-teal-400/30 to-emerald-400/30 blur-2xl" />

            {/* Subtle inner border */}
            <div className="pointer-events-none absolute inset-3 rounded-2xl ring-1 ring-inset ring-emerald-200/30" />

            {/* Form content */}
            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-300/50 rotate-3 hover:rotate-0 transition-transform duration-300 ring-4 ring-white/50">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                    Selamat Datang Kembali!
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Masuk ke akun Anda untuk melanjutkan monitoring kesehatan
                  </p>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-5">
                {/* Login field */}
                <div className="space-y-2">
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
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                    }`}
                    placeholder="Masukkan email atau username"
                  />
                  {errors.login && (
                    <p className="text-xs text-red-600 font-medium">{errors.login}</p>
                  )}
                </div>

                {/* Password field */}
                <div className="space-y-2">
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
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
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
                    <p className="text-xs text-red-600 font-medium">{errors.password}</p>
                  )}
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="group relative w-full h-13 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-300/50 hover:shadow-emerald-400/60 hover:shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? "Memproses..." : "Masuk Sekarang"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Button shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </button>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t-2 border-emerald-100/50 text-center">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <Link
                    href="/register/user"
                    className="relative z-20 font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
                  >
                    Daftar Sekarang
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};