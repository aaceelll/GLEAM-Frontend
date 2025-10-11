"use client";

import { useState } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export function StaffLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: "login" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setError(null);
    };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await login({ login: form.login, password: form.password });

      const role = user.role as string;
      if (role === "super_admin" || role === "admin") router.replace("/dashboard/admin");
      else if (role === "manajemen") router.replace("/dashboard/manajemen");
      else if (role === "nakes") router.replace("/dashboard/nakes");
      else router.replace("/dashboard/user");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Login gagal. Periksa email/password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    // === Wrapper sangat simpel: TIDAK ada background lokal, tidak min-h-screen ===
    <div className="w-full">
      {/* Centered Card */}
      <div className="w-full max-w-md mx-auto py-12">
        <div className="relative overflow-hidden bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-white/60 p-8 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:to-emerald-50/40 before:rounded-3xl before:pointer-events-none">
          {/* Top glow line */}
          <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

          {/* Corner accent lights */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-400/30 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-gradient-to-tr from-teal-400/30 to-emerald-400/30 blur-2xl" />

          {/* Subtle inner border */}
          <div className="pointer-events-none absolute inset-3 rounded-2xl ring-1 ring-inset ring-emerald-200/30" />

            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-3">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-300/50 rotate-3 hover:rotate-0 transition-transform duration-300 ring-4 ring-white/50">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                    Masuk Staff/Petugas
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Masuk sebagai admin, manajemen, atau tenaga kesehatan
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-800">
                    Username atau Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.login}
                    onChange={handleChange("login")}
                    className="w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                    placeholder="Masukkan username/email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-800">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange("password")}
                      className="w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                      placeholder="Masukkan password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-sm text-red-800 text-center font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative w-full h-13 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-300/50 hover:shadow-emerald-400/60 hover:shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] mt-6 py-3"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {submitting ? "Memproses..." : "Masuk"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </button>
              </form>

              <div className="pt-4 border-t-2 border-emerald-100/50 text-center">
                <p className="text-sm text-gray-600">
                  Lupa password?{" "}
                  <Link
                    href="/forgot-password"
                    className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                  >
                    Reset di sini
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}