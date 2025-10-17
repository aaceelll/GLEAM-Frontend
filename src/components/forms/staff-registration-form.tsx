  "use client";

  import * as React from "react";
  import Link from "next/link";
  import { useRouter } from "next/navigation";
  import { Eye, EyeOff, Users } from "lucide-react";
  import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";
  import { ChevronsUpDown, Check } from "lucide-react";


  const API_BASE = process.env.NEXT_PUBLIC_API_URL!;


  type Role = "admin" | "manajemen" | "nakes";

  export function StaffRegistrationForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [showRoleDropdown, setShowRoleDropdown] = React.useState(false);

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

    const rolePath: Record<Role, string> = {
      admin: "/admin",
      manajemen: "/manajemen",
      nakes: "/nakes",
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!formData.role) {
        setError("Silakan pilih role.");
        return;
      }
      if (formData.password !== formData.konfirmasiPassword) {
        setError("Konfirmasi password tidak sesuai.");
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
          nomor_telepon: formData.nomorTelepon,   // <— pakai nama persis yang di backend
          role: formData.role,                    // "admin" | "manajemen" | "nakes"
          password: formData.password,
          password_confirmation: formData.konfirmasiPassword,
        }),
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        const msg =
          data?.message ||
          (data?.errors ? Object.values(data.errors).flat().join(", ") : "Gagal mendaftar");
        throw new Error(msg);
      }


        const next = formData.role ? rolePath[formData.role] : "/";
        router.push(`/login/staff?registered=1&next=${encodeURIComponent(next)}`);
      } catch (err: any) {
        setError(err?.message || "Terjadi kesalahan server.");
      } finally {
        setLoading(false);
      }
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
                      Selamat datang! Silakan daftar sebagai admin, manajemen, atau tenaga kesehatan
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                      onChange={(e) => onChange("email", e.target.value)}
                      className="w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                      placeholder="Masukkan email"
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
                      placeholder="Masukkan username"
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
                      onChange={(e) => onChange("nomorTelepon", e.target.value)}
                      className="w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white/90 backdrop-blur-sm border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                      placeholder="Masukkan nomor telepon"
                      required
                    />
                  </div>

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

    {/* biar form validity tetap jalan di browser */}
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
                        placeholder="Masukkan konfirmasi password"
                        required
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

                  {error && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                      <p className="text-sm text-red-800 text-center font-medium">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full h-13 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-300/50 hover:shadow-emerald-400/60 hover:shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] mt-6 py-3"
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
        </div>
    );
  }
