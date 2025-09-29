"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"
// contoh benar: kalau NEXT_PUBLIC_API_URL=http://localhost:8000/api maka endpoint jadi `${API_BASE}/register/staff`

type Role = "admin" | "manajemen" | "nakes"

export function StaffRegistrationForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [formData, setFormData] = React.useState({
    nama: "",
    email: "",
    username: "",
    nomorTelepon: "",
    role: "" as "" | Role,
    password: "",
    konfirmasiPassword: "",
  })

  const onChange = (field: keyof typeof formData, value: string) =>
    setFormData((p) => ({ ...p, [field]: value }))

  const rolePath: Record<Role, string> = {
    admin: "/admin",
    manajemen: "/manajemen",
    nakes: "/nakes",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validasi simple di FE
    if (!formData.role) {
      setError("Silakan pilih role.")
      return
    }
    if (formData.password !== formData.konfirmasiPassword) {
      setError("Konfirmasi password tidak sesuai.")
      return
    }

    setLoading(true)
    try {
      // Sesuaikan endpoint backend kamu di sini
      const res = await fetch(`${API_BASE}/register/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          // mapping ke Laravel (silakan sesuaikan naming kalau berbeda)
          nama: formData.nama,
          email: formData.email,
          username: formData.username,
          nomor_telepon: formData.nomorTelepon,
          // sering Laravel pakai 'phone', jadi kirim keduanya aman:
          phone: formData.nomorTelepon,
          role: formData.role,
          password: formData.password,
          password_confirmation: formData.konfirmasiPassword,
        }),
        credentials: "omit",
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        // Ambil pesan error dari Laravel kalau ada
        const msg =
          (data?.message as string) ||
          (typeof data === "object" ? JSON.stringify(data) : "Gagal mendaftar")
        throw new Error(msg)
      }

      // Sukses bikin akun → direct ke halaman login, sambil bawa next role
      const next = formData.role ? rolePath[formData.role] : "/"
      router.push(`/login/staff?registered=1&next=${encodeURIComponent(next)}`)
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-xl rounded-3xl">
      <CardContent className="p-8">
        {/* Heading & subheading di dalam card */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Daftar Staff/Petugas</h1>
          <p className="text-muted-foreground">
            Selamat datang! Silakan daftar sebagai admin, manajemen, atau tenaga kesehatan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama */}
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-sm font-medium">
              Nama <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama"
              type="text"
              placeholder="Masukkan nama"
              value={formData.nama}
              onChange={(e) => onChange("nama", e.target.value)}
              className="h-12 w-full"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="h-12 w-full"
              required
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username <span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={(e) => onChange("username", e.target.value)}
              className="h-12 w-full"
              required
            />
          </div>

          {/* Nomor Telepon */}
          <div className="space-y-2">
            <Label htmlFor="nomorTelepon" className="text-sm font-medium">
              Nomor Telepon <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nomorTelepon"
              type="tel"
              placeholder="Masukkan nomor telepon"
              value={formData.nomorTelepon}
              onChange={(e) => onChange("nomorTelepon", e.target.value)}
              className="h-12 w-full"
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.role}
              onValueChange={(v) => onChange("role", v as Role)}
            >
              <SelectTrigger className="h-12 w-full">
                <SelectValue placeholder="Pilih jenis role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manajemen">Manajemen</SelectItem>
                <SelectItem value="nakes">Tenaga Kesehatan (Nakes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => onChange("password", e.target.value)}
                className="h-12 w-full pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-2">
            <Label htmlFor="konfirmasiPassword" className="text-sm font-medium">
              Konfirmasi Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="konfirmasiPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Masukkan konfirmasi password"
                value={formData.konfirmasiPassword}
                onChange={(e) => onChange("konfirmasiPassword", e.target.value)}
                className="h-12 w-full pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label={showConfirmPassword ? "Sembunyikan konfirmasi" : "Tampilkan konfirmasi"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            disabled={loading}
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </Button>
        </form>

        {/* Link login di dalam card */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login/staff" className="text-primary hover:text-primary/80 font-medium">
              Masuk Sekarang
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
