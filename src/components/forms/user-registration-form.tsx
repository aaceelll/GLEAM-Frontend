// src/components/forms/user-registration-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, UserPlus, CheckCircle2 } from "lucide-react";

type FormData = {
  nama: string;
  email: string;
  username: string;
  nomor_telepon: string;
  password: string;
  password_confirmation: string;
};

type ApiSuccess = {
  token?: string;
  [k: string]: unknown;
};

type ApiError = {
  message?: string;
  errors?: Record<string, string[]>;
  [k: string]: unknown;
};

type ErrorMap = Partial<Record<keyof FormData, string>>;

const isApiError = (v: unknown): v is ApiError =>
  typeof v === "object" && v !== null && ("message" in v || "errors" in v);

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function UserRegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<ErrorMap>({});
  // NEW: popup sukses bergaya selaras UI
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [form, setForm] = useState<FormData>({
    nama: "",
    email: "",
    username: "",
    nomor_telepon: "",
    password: "",
    password_confirmation: "",
  });

  const onChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredFields: (keyof FormData)[] = [
      "nama",
      "email",
      "username",
      "nomor_telepon",
      "password",
      "password_confirmation",
    ];

    for (const field of requiredFields) {
      if (!form[field]) {
        alert(`Field ${field} wajib diisi`);
        return;
      }
    }

    if (form.password !== form.password_confirmation) {
      alert("Password dan konfirmasi password tidak sama");
      return;
    }

    if (form.password.length < 8) {
      alert("Password minimal 8 karakter");
      return;
    }

    setShowTermsPopup(true);
  };

  const handleAcceptTerms = async () => {
    if (!agreedToTerms) {
      alert("Anda harus menyetujui persyaratan terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nama: form.nama,
          email: form.email,
          username: form.username,
          nomor_telepon: form.nomor_telepon,
          password: form.password,
          password_confirmation: form.password_confirmation,
        }),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const d = isApiError(data) ? data : undefined;
        const errorMsg =
          d?.message ||
          (d?.errors
            ? Object.values(d.errors).flat().join(", ")
            : "Registrasi gagal");
        throw new Error(errorMsg);
      }

      const ok = data as ApiSuccess;
      if (ok.token) {
        localStorage.setItem("gleam_token", ok.token);
        document.cookie = `auth_token=${ok.token}; Path=/; Max-Age=${
          60 * 60 * 24 * 7
        }; SameSite=Lax`;
      }

      // Ganti alert native -> modal sukses selaras UI
      setShowSuccessPopup(true);
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const msg =
        err instanceof Error ? err.message : "Terjadi kesalahan saat registrasi";
      alert(msg);
    } finally {
      setLoading(false);
      setShowTermsPopup(false);
    }
  };

  // Ketika user menekan tombol OK pada modal sukses
  const proceedAfterSuccess = () => {
    setShowSuccessPopup(false);
    router.push("/dashboard/user/personal-info");
  };

  return (
    <div className="w-full">
      {/* Centered Card */}
      <div className="w-full max-w-md mx-auto py-12 px-4">
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
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  Daftar Akun Pasien
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Bergabunglah dengan GLEAM untuk monitoring kesehatan diabetes
                  Anda
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-800">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => onChange("nama", e.target.value)}
                  className="w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                  placeholder="Masukkan nama lengkap"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-800">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                  placeholder="nama@email.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-800">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => onChange("username", e.target.value)}
                  className="w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                  placeholder="username123"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-800">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={form.nomor_telepon}
                  onChange={(e) => onChange("nomor_telepon", e.target.value)}
                  className="w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                  placeholder="08123456789"
                  autoComplete="tel"
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
                    onChange={(e) => onChange("password", e.target.value)}
                    className="w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-800">
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.password_confirmation}
                    onChange={(e) => onChange("password_confirmation", e.target.value)}
                    className="w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                    aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-300/50 hover:shadow-emerald-400/60 hover:shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] mt-6 py-3"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Memproses..." : "Daftar Sekarang"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </button>
            </form>

            <div className="pt-4 border-t-2 border-emerald-100/50 text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  href="/login/user"
                  className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                >
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Popup */}
      {showTermsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-emerald-50 to-white border-b border-emerald-100">
              <h2 className="text-2xl font-bold text-emerald-700">Syarat dan Persetujuan</h2>
              <p className="text-sm text-gray-600 mt-2">
                Dengan ini saya menyatakan bahwa saya setuju untuk ikut berpartisipasi dalam penelitian berbasis website ini{" "}
                <span className="font-semibold text-emerald-700">"GLEAM"</span> dengan penuh kesadaran dan tanpa ada paksaan dari siapapun dengan kondisi:
              </p>
            </div>

            <div className="px-6 py-5 overflow-y-auto flex-1">
              <div className="space-y-4 text-sm text-gray-700 bg-emerald-50 p-4 rounded-xl">
                <div className="flex gap-3">
                  <span className="font-bold text-emerald-700 flex-shrink-0">1.</span>
                  <p className="leading-relaxed">
                    Data yang didapatkan dari penelitian ini akan dijaga kerahasiaannya dan hanya digunakan untuk kepentingan ilmiah.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-emerald-700 flex-shrink-0">2.</span>
                  <p className="leading-relaxed">
                    Saya berhak untuk mengundurkan diri dari penelitian ini kapan saja tanpa perlu memberikan alasan apa pun.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mt-5 pt-4 border-t border-emerald-100">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-relaxed cursor-pointer text-gray-700"
                >
                  Saya menyetujui persyaratan di atas dan bersedia berpartisipasi dalam penelitian ini
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-emerald-100 flex gap-3">
              <button
                onClick={() => setShowTermsPopup(false)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAcceptTerms}
                disabled={!agreedToTerms || loading}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : "Daftar Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup (ganti alert native) */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-emerald-100">
            {/* Header gradient */}
            <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-emerald-50 to-white border-b border-emerald-100">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-teal-400/20 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md ring-4 ring-white/60">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800">Registrasi Berhasil</h3>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 text-sm text-gray-700">
              <p className="leading-relaxed">
                Akunmu berhasil dibuat. Silakan lengkapi <span className="font-semibold text-emerald-700">informasi pribadi</span> terlebih dahulu untuk pengalaman yang optimal.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-emerald-100 flex justify-end">
              <button
                onClick={proceedAfterSuccess}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                autoFocus
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
