// src/components/forms/staff-registration-form.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Users, CheckCircle2, ShieldAlert } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Check } from "lucide-react";

type Role = "admin" | "manajemen" | "nakes";

type ApiSuccess = { token?: string; [k: string]: unknown };
type ApiError = { message?: string; errors?: Record<string, string[]>; [k: string]: unknown };
const isApiError = (v: unknown): v is ApiError =>
  typeof v === "object" && v !== null && ("message" in v || "errors" in v);

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

/* ========= VALIDATORS ========= */
const isStrongPassword = (v: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(v); // min 8, ada lower, upper, special
const isValidPhone = (v: string) => /^08\d{8,11}$/.test(v); // mulai 08, total 10–13 digit
const isGmail = (v: string) => /^[A-Za-z0-9._%+-]+@gmail\.com$/i.test(v); // hanya @gmail.com

export function StaffRegistrationForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Popup states (samain gaya dengan UserRegistrationForm)
  const [validation, setValidation] = React.useState<{ open: boolean; title: string; message: string }>({
    open: false,
    title: "",
    message: "",
  });
  const showValidation = (message: string, title = "Validasi Gagal") =>
    setValidation({ open: true, title, message });
  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);

  const [formData, setFormData] = React.useState({
    nama: "",
    email: "",
    username: "",
    nomorTelepon: "",
    role: "" as "" | Role,
    password: "",
    konfirmasiPassword: "",
  });

  const onChange = (field: keyof typeof formData, value: string) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Required
    const required: (keyof typeof formData)[] = [
      "nama",
      "email",
      "username",
      "nomorTelepon",
      "password",
      "konfirmasiPassword",
    ];
    for (const f of required) {
      if (!formData[f]) {
        showValidation(`Field ${f} wajib diisi`);
        return;
      }
    }

    if (!formData.role) {
      showValidation("Silakan pilih role staff.");
      return;
    }
    if (!isGmail(formData.email.trim())) {
      showValidation("Email harus menggunakan domain Gmail (contoh: nama@gmail.com).");
      return;
    }
    if (!isValidPhone(formData.nomorTelepon)) {
      showValidation("Nomor telepon harus diawali 08 dan berjumlah 10–13 digit (hanya angka).");
      return;
    }
    if (!isStrongPassword(formData.password)) {
      showValidation(
        "Password minimal 8 karakter dan harus mengandung huruf kecil, huruf besar, dan karakter spesial."
      );
      return;
    }
    if (formData.password !== formData.konfirmasiPassword) {
      showValidation("Password dan konfirmasi password tidak sama");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          nama: formData.nama,
          email: formData.email,
          username: formData.username,
          nomor_telepon: formData.nomorTelepon, // harus snake_case sesuai backend
          role: formData.role, // "admin" | "manajemen" | "nakes"
          password: formData.password,
          password_confirmation: formData.konfirmasiPassword,
        }),
      });

      const data: unknown = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        const d = isApiError(data) ? data : undefined;
        const msg =
          d?.message ||
          (d?.errors ? (Object.values(d.errors) as string[][]).flat().join(", ") : "Gagal mendaftar");
        throw new Error(msg);
      }

      setShowSuccessPopup(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan server.";
      setError(msg);
      showValidation(msg, "Registrasi Gagal");
    } finally {
      setLoading(false);
    }
  };

  const proceedAfterSuccess = () => {
    setShowSuccessPopup(false);
    // Arahin ke login setelah sukses (konsisten dan aman)
    router.push("/login?registered=1");
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
                <Users className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  Daftar Staff/Petugas
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Silakan daftar sebagai Admin, Manajemen, atau Tenaga Kesehatan
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-800">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => onChange("nama", e.target.value)}
                  className="w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                  placeholder="Masukkan nama"
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
                  value={formData.email}
                  onChange={(e) => onChange("email", e.target.value.trim())}
                  className="w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                  placeholder="nama@gmail.com"
                  autoComplete="email"
                  pattern="^[A-Za-z0-9._%+-]+@gmail\.com$"
                  title="Gunakan email @gmail.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-800">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
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
                  value={formData.nomorTelepon}
                  onChange={(e) =>
                    onChange("nomorTelepon", e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                  placeholder="Contoh: 081234567890"
                  inputMode="numeric"
                  pattern="^08\\d{8,11}$"
                  maxLength={13}
                  autoComplete="tel"
                  required
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-800">
                  Role <span className="text-red-500">*</span>
                </label>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-between gap-3 px-4 py-3.5 border-2 rounded-xl text-sm bg-white/90 backdrop-blur-sm border-emerald-200 hover:border-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                      aria-label="Pilih role"
                    >
                      <span className={`truncate ${formData.role ? "text-gray-900" : "text-gray-500"}`}>
                        {formData.role
                          ? formData.role === "nakes"
                            ? "Tenaga Kesehatan (Nakes)"
                            : formData.role.charAt(0).toUpperCase() + formData.role.slice(1)
                          : "Pilih jenis role"}
                      </span>
                      <ChevronsUpDown className="w-4 h-4 opacity-70" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-[var(--radix-dropdown-menu-trigger-width)] p-1 rounded-xl border-2 border-emerald-200 bg-white/95 backdrop-blur-md shadow-xl"
                  >
                    <DropdownMenuItem
                      className="rounded-lg px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer"
                      onClick={() => onChange("role", "admin")}
                    >
                      <span className="inline-flex items-center gap-2">
                        {formData.role === "admin" ? <Check className="w-4 h-4" /> : <span className="w-4 h-4" />}
                        Admin
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="rounded-lg px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer"
                      onClick={() => onChange("role", "manajemen")}
                    >
                      <span className="inline-flex items-center gap-2">
                        {formData.role === "manajemen" ? <Check className="w-4 h-4" /> : <span className="w-4 h-4" />}
                        Manajemen
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="rounded-lg px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer"
                      onClick={() => onChange("role", "nakes")}
                    >
                      <span className="inline-flex items-center gap-2">
                        {formData.role === "nakes" ? <Check className="w-4 h-4" /> : <span className="w-4 h-4" />}
                        Tenaga Kesehatan (Nakes)
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Hidden untuk trigger native required */}
                <input type="hidden" name="role" value={formData.role} required />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-800">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
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
                    value={formData.konfirmasiPassword}
                    onChange={(e) => onChange("konfirmasiPassword", e.target.value)}
                    className="w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                    aria-label={
                      showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"
                    }
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl" role="alert" aria-live="polite">
                  <p className="text-sm text-red-800 text-center font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-300/50 hover:shadow-emerald-400/60 hover:shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] mt-6 py-3"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Mendaftar..." : "Daftar"}
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
                  href="/login"
                  className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                >
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup (gaya sama dengan UserRegistrationForm) */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-emerald-100">
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

            <div className="px-6 py-5 text-sm text-gray-700">
              <p className="leading-relaxed">
                Akun staff berhasil dibuat. Silakan{" "}
                <span className="font-semibold text-emerald-700">masuk</span> menggunakan kredensial Anda.
              </p>
            </div>

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

      {/* Validation Popup (ganti alert) */}
      {validation.open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-rose-100">
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-rose-50 to-white border-b border-rose-100">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-rose-400/20 blur-2xl" />
              <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-amber-400/20 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-md ring-4 ring-white/60">
                  <ShieldAlert className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-rose-700">{validation.title}</h3>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 text-sm text-gray-700">
              <p className="leading-relaxed">{validation.message}</p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-rose-100 flex justify-end">
              <button
                onClick={() => setValidation({ open: false, title: "", message: "" })}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
