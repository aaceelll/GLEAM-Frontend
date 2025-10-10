// src/components/forms/user-registration-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface FormData {
  nama: string;
  email: string;
  username: string;
  nomor_telepon: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  alamat: string;
  password: string;
  password_confirmation: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function UserRegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [form, setForm] = useState<FormData>({
    nama: "",
    email: "",
    username: "",
    nomor_telepon: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    password: "",
    password_confirmation: "",
  });

  const onChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    const requiredFields = [
      "nama",
      "email",
      "nomor_telepon",
      "tanggal_lahir",
      "jenis_kelamin",
      "alamat",
      "password",
      "password_confirmation",
    ] as const;

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

    // Tampilkan popup terms
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
          tanggal_lahir: form.tanggal_lahir,
          jenis_kelamin: form.jenis_kelamin,
          alamat: form.alamat,
          password: form.password,
          password_confirmation: form.password_confirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data?.message ||
          (typeof data?.errors === "object"
            ? Object.values(data.errors).flat().join(", ")
            : "Registrasi gagal");
        throw new Error(errorMsg);
      }

      // Simpan token
      if (data.token) {
        localStorage.setItem("gleam_token", data.token);
        document.cookie = `auth_token=${data.token}; Path=/; Max-Age=${
          60 * 60 * 24 * 7
        }; SameSite=Lax`;
      }

      // Redirect ke personal info page
      alert("Registrasi berhasil! Silakan lengkapi informasi pribadi Anda.");
      router.push("/dashboard/user/personal-info");
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.message || "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
      setShowTermsPopup(false);
    }
  };

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <Label className="text-sm font-medium text-emerald-700">
      {children} <span className="text-red-500">*</span>
    </Label>
  );

  return (
    <>
      <Card className="border-0 shadow-xl ring-1 ring-emerald-100 rounded-2xl max-w-md w-full bg-white">
        <CardHeader className="text-center pb-4 bg-gradient-to-b from-emerald-50 to-white rounded-t-2xl">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-8 h-8 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-700">
            Daftar Akun Pasien
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Bergabunglah dengan GLEAM untuk monitoring kesehatan diabetes Anda
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pt-6 pb-4">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Nama */}
            <div className="space-y-2">
              <RequiredLabel>Nama Lengkap</RequiredLabel>
              <Input
                className="h-11 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                value={form.nama}
                onChange={(e) => onChange("nama", e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <RequiredLabel>Email</RequiredLabel>
              <Input
                type="email"
                className="h-11 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="nama@email.com"
                required
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <RequiredLabel>Username</RequiredLabel>
              <Input
                className="h-11 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                value={form.username}
                onChange={(e) => onChange("username", e.target.value)}
                placeholder="username123"
                required
              />
            </div>

            {/* Nomor Telepon */}
            <div className="space-y-2">
              <RequiredLabel>Nomor Telepon</RequiredLabel>
              <Input
                type="tel"
                className="h-11 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                value={form.nomor_telepon}
                onChange={(e) => onChange("nomor_telepon", e.target.value)}
                placeholder="08123456789"
                required
              />
            </div>

            {/* Tanggal Lahir */}
            <div className="space-y-2">
              <RequiredLabel>Tanggal Lahir</RequiredLabel>
              <Input
                type="date"
                className="h-11 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                value={form.tanggal_lahir}
                onChange={(e) => onChange("tanggal_lahir", e.target.value)}
                required
              />
            </div>

            {/* Jenis Kelamin */}
<div className="space-y-2">
  <RequiredLabel>Jenis Kelamin</RequiredLabel>
  <Select
    value={form.jenis_kelamin}
    onValueChange={(value) => onChange("jenis_kelamin", value)}
  >
    <SelectTrigger className="h-11 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
      <SelectValue placeholder="Pilih jenis kelamin" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
      <SelectItem value="Perempuan">Perempuan</SelectItem>
    </SelectContent>
  </Select>
</div>

            {/* Alamat */}
            <div className="space-y-2">
              <RequiredLabel>Alamat</RequiredLabel>
              <Input
                className="h-11 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                value={form.alamat}
                onChange={(e) => onChange("alamat", e.target.value)}
                placeholder="Masukkan alamat lengkap"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <RequiredLabel>Password</RequiredLabel>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="h-11 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
                  value={form.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div className="space-y-2">
              <RequiredLabel>Konfirmasi Password</RequiredLabel>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="h-11 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
                  value={form.password_confirmation}
                  onChange={(e) =>
                    onChange("password_confirmation", e.target.value)
                  }
                  placeholder="Ulangi password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
            >
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center pt-2 pb-6 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              href="/login/user"
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Masuk Sekarang
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Terms & Conditions Popup */}
      <Dialog open={showTermsPopup} onOpenChange={setShowTermsPopup}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-700">
              Syarat dan Persetujuan
            </DialogTitle>
            <DialogDescription className="text-base text-gray-700 pt-4 leading-relaxed">
              Dengan ini saya menyatakan bahwa saya setuju untuk ikut
              berpartisipasi dalam penelitian berbasis website ini{" "}
              <span className="font-semibold text-emerald-700">"GLEAM"</span>{" "}
              dengan penuh kesadaran dan tanpa ada paksaan dari siapapun dengan
              kondisi:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-4 text-sm text-gray-700 bg-emerald-50 p-4 rounded-lg">
              <div className="flex gap-3">
                <span className="font-bold text-emerald-700 flex-shrink-0">
                  1.
                </span>
                <p className="leading-relaxed">
                  Data yang didapatkan dari penelitian ini akan dijaga
                  kerahasiaannya dan hanya digunakan untuk kepentingan ilmiah.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-emerald-700 flex-shrink-0">
                  2.
                </span>
                <p className="leading-relaxed">
                  Saya berhak untuk mengundurkan diri dari penelitian ini kapan
                  saja tanpa perlu memberikan alasan apa pun.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 pt-2 border-t border-emerald-100">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked as boolean)
                }
                className="border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 mt-1"
              />
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-relaxed cursor-pointer text-gray-700"
              >
                Saya menyetujui persyaratan di atas dan bersedia berpartisipasi
                dalam penelitian ini
              </Label>
            </div>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleAcceptTerms}
              disabled={!agreedToTerms || loading}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                "Daftar Sekarang"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}