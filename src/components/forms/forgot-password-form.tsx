// src/components/forms/forgot-password-form.tsx
"use client";

import React, { useState } from "react";
import { KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    login: "",
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (
      !formData.login ||
      !formData.old_password ||
      !formData.password ||
      !formData.password_confirmation
    ) {
      setError("Semua field wajib diisi");
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      setError("Password baru dan konfirmasi password tidak sama");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Gagal mengubah password");
      setSuccess(true);
      setTimeout(() => router.push("/login/user"), 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat mengubah password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Soft blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[26rem] w-[26rem] rounded-full bg-emerald-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[26rem] w-[26rem] rounded-full bg-teal-200/25 blur-3xl" />
      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.05)_100%)]" />

      {/* Hex pattern hijau */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.25]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexPattern" x="0" y="0" width="80" height="69.28" patternUnits="userSpaceOnUse">
              <path
                d="M20,0 L60,0 L80,34.64 L60,69.28 L20,69.28 L0,34.64 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-emerald-500/40"
              />
            </pattern>
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

      {/* Grid titik & garis hijau */}
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

      {/* Noise + vignette hijau */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0)_0%,rgba(16,185,129,0)_50%,rgba(5,150,105,0.15)_100%)]" />

      {/* Aksen sudut hijau */}
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

      {/* Partikel hijau */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-emerald-400/50 rounded-full animate-ping"
          style={{ animationDuration: "3s", animationDelay: "0s" }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-teal-400/50 rounded-full animate-ping"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-cyan-400/50 rounded-full animate-ping"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/5 w-2 h-2 bg-emerald-500/40 rounded-full animate-ping"
          style={{ animationDuration: "4.5s", animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 bg-teal-500/40 rounded-full animate-ping"
          style={{ animationDuration: "3.5s", animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-2/3 right-1/5 w-2 h-2 bg-cyan-500/40 rounded-full animate-ping"
          style={{ animationDuration: "4.2s", animationDelay: "2.5s" }}
        />
      </div>

      {/* Kartu & form */}
      <div className="relative z-10 w-full flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-white/60 p-8 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:to-emerald-50/40 before:rounded-3xl before:pointer-events-none">
            <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-400/30 blur-2xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-gradient-to-tr from-teal-400/30 to-emerald-400/30 blur-2xl" />
            <div className="pointer-events-none absolute inset-3 rounded-2xl ring-1 ring-inset ring-emerald-200/30" />

            <div className="relative z-10 space-y-6">
              <Link
                href="/login/user"
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Kembali ke Login
              </Link>

              <div className="text-center space-y-3">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-300/50 rotate-3 hover:rotate-0 transition-transform duration-300 ring-4 ring-white/50">
                  <KeyRound className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                    Ubah Password
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Masukkan informasi akun dan password baru Anda
                  </p>
                </div>
              </div>

              {success && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                  <p className="text-sm text-emerald-800 text-center font-medium">
                    ✓ Password berhasil diubah! Mengalihkan ke halaman login...
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-sm text-red-800 text-center font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-800">
                    Email atau Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.login}
                    onChange={(e) => handleChange("login", e.target.value)}
                    className="w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                    placeholder="email@example.com atau username"
                    disabled={loading || success}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-800">
                    Password Lama <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={formData.old_password}
                      onChange={(e) => handleChange("old_password", e.target.value)}
                      className="w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                      placeholder="Masukkan password lama"
                      disabled={loading || success}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-800">
                    Password Baru <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                      placeholder="Minimal 6 karakter"
                      disabled={loading || success}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-800">
                    Konfirmasi Password Baru <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.password_confirmation}
                      onChange={(e) =>
                        handleChange("password_confirmation", e.target.value)
                      }
                      className="w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                      placeholder="Ulangi password baru"
                      disabled={loading || success}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="group relative w-full h-13 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-300/50 hover:shadow-emerald-400/60 hover:shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] mt-6 py-3"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? "Mengubah Password..." : success ? "Berhasil!" : "Ubah Password"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </button>
              </form>

              <div className="pt-4 border-t-2 border-emerald-100/50 text-center">
                <p className="text-sm text-gray-600">
                  Ingat password?{" "}
                  <Link
                    href="/login/user"
                    className="relative z-20 font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
                  >
                    Masuk Sekarang
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}