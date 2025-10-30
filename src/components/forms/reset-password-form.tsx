"use client";

import React, { useState, useEffect } from "react";
import { KeyRound, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

const isStrongPassword = (v: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(v);

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    token: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setError("Link reset password tidak valid");
      return;
    }

    setFormData((prev) => ({ ...prev, token, email }));
  }, [searchParams]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.password || !formData.password_confirmation) {
      setError("Semua field wajib diisi");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setError(
        "Password baru minimal 8 karakter dan harus mengandung huruf kecil, huruf besar, dan karakter spesial."
      );
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.message || "Gagal mereset password");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  if (!formData.token || !formData.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">Link tidak valid</p>
          <Link href="/forgot-password" className="text-emerald-600 hover:underline">
            Request Link Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-emerald-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-emerald-50">Buat password baru untuk akun Anda</p>
          </div>

          <div className="p-8">
            {success ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-emerald-800 mb-2">
                    Password Berhasil Diubah!
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Mengalihkan ke halaman login...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-sm text-red-800 text-center font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-emerald-800">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      className="w-full px-4 py-3.5 border-2 rounded-xl text-sm bg-gray-50 border-gray-200"
                      disabled
                    />
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
                        placeholder="Minimal 8 karakter"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Min. 8 karakter, huruf besar, huruf kecil, dan karakter spesial
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-emerald-800">
                      Konfirmasi Password Baru <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.password_confirmation}
                        onChange={(e) => handleChange("password_confirmation", e.target.value)}
                        className="w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                        placeholder="Ulangi password baru"
                        disabled={loading}
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
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        Memproses...
                      </span>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    Kembali ke Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}