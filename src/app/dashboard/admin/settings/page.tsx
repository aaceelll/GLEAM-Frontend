"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Save, User, Lock, Mail, Phone, CheckCircle2, AlertCircle, Settings } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

type ProfilePayload = {
  nama: string
  email: string
  username: string
  nomor_telepon?: string
}

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile")
  const [profile, setProfile] = useState<ProfilePayload>({
    nama: "",
    email: "",
    username: "",
    nomor_telepon: "",
  })

  const [oldPass, setOldPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [show, setShow] = useState({ old: false, new: false, confirm: false })

  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const { setUser } = useAuth()

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get("/profile")
        const u = data?.data
        setProfile({
          nama: u?.nama ?? "",
          email: u?.email ?? "",
          username: u?.username ?? "",
          nomor_telepon: u?.nomor_telepon ?? "",
        })
        localStorage.setItem("user_data", JSON.stringify(u))
      } catch {
        setMsg({ type: "error", text: "Gagal memuat profil." })
      }
    })()
  }, [])

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault()
    setMsg(null)
    try {
      const { data } = await api.put("/profile", profile)
      const updated = data?.user ?? data?.data ?? profile

      setProfile((prev) => ({
        ...prev,
        nama: updated.nama ?? "",
        email: updated.email ?? "",
        username: updated.username ?? "",
        nomor_telepon: updated.nomor_telepon ?? "",
      }))

      localStorage.setItem("user_data", JSON.stringify(updated))
      setUser(updated)

      setMsg({ type: "success", text: "Profil berhasil diperbarui." })
      setTimeout(() => setMsg(null), 3000)
    } catch (err) {
      const resData = (err as any)?.response?.data
      const errors = (resData?.errors as Record<string, string[] | string> | undefined) ?? undefined

      const first = errors ? Object.values(errors)[0] : undefined
      const firstMsg = Array.isArray(first) ? first[0] : first

      const text = (firstMsg as string) || resData?.message || "Gagal menyimpan profil."

      setMsg({ type: "error", text })
    }
  }

  async function handleSavePassword(e: FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (!oldPass || !newPass || !confirmPass) {
      setMsg({ type: "error", text: "Semua field password wajib diisi." })
      return
    }
    if (newPass !== confirmPass) {
      setMsg({ type: "error", text: "Konfirmasi password tidak cocok." })
      return
    }

    try {
      await api.patch("/profile/password", {
        old_password: oldPass,
        new_password: newPass,
        new_password_confirmation: confirmPass,
      })
      setMsg({ type: "success", text: "Password berhasil diperbarui." })
      setOldPass("")
      setNewPass("")
      setConfirmPass("")
      setTimeout(() => setMsg(null), 3000)
    } catch (err) {
      const resData = (err as any)?.response?.data
      const errors = (resData?.errors as Record<string, string[] | string> | undefined) ?? undefined

      const first = errors ? Object.values(errors)[0] : undefined
      const firstMsg = Array.isArray(first) ? first[0] : first

      const text = (firstMsg as string) || resData?.message || "Gagal memperbarui password."

      setMsg({ type: "error", text })
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header with icon */}
        <header>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent">
                Pengaturan Akun
              </h1>
              <p className="text-gray-600 mt-0.5">Kelola profil dan keamanan akun Anda</p>
            </div>
          </div>
        </header>

        {/* Notification */}
        {msg && (
          <div
            className={`rounded-2xl px-5 py-4 flex items-start gap-3 backdrop-blur-sm animate-in slide-in-from-top-2 shadow-lg ${
              msg.type === "success"
                ? "bg-emerald-500/10 border-2 border-emerald-200 text-emerald-900"
                : "bg-red-500/10 border-2 border-red-200 text-red-900"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="font-medium">{msg.text}</span>
          </div>
        )}

        {/* Navigation Pills */}
        <div className="flex gap-3 p-0 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-100 shadow-lg">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-6 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <User className="h-5 w-5" />
            Profil Saya
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === "security"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Lock className="h-5 w-5" />
            Keamanan
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" ? (
          <Card className="p-8 border-2 border-gray-100 rounded-3xl bg-white shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b-2 border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Informasi Profil</h2>
                  <p className="text-sm text-slate-600">Perbarui data pribadi Anda</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Nama Lengkap"
                  icon={<User className="h-5 w-5 text-slate-400" />}
                  required
                  value={profile.nama}
                  onChange={(v) => setProfile((p) => ({ ...p, nama: v }))}
                  placeholder="Masukkan nama lengkap"
                />

                <InputField
                  label="Alamat Email"
                  icon={<Mail className="h-5 w-5 text-slate-400" />}
                  required
                  type="email"
                  value={profile.email}
                  onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
                  placeholder="nama@email.com"
                />

                <InputField
                  label="Username"
                  icon={<User className="h-5 w-5 text-slate-400" />}
                  required
                  value={profile.username}
                  onChange={(v) => setProfile((p) => ({ ...p, username: v }))}
                  placeholder="username_anda"
                />

                <InputField
                  label="Nomor Telepon"
                  icon={<Phone className="h-5 w-5 text-slate-400" />}
                  value={profile.nomor_telepon}
                  onChange={(v) => setProfile((p) => ({ ...p, nomor_telepon: v }))}
                  placeholder="+62 812 3456 7890"
                />

                <div className="flex justify-end pt-2 md:col-span-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Save className="h-5 w-5" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </Card>
        ) : null}

        {/* Security Tab */}
        {activeTab === "security" ? (
          <Card className="p-8 border-2 border-gray-100 rounded-3xl bg-white shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b-2 border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Ubah Password</h2>
                  <p className="text-sm text-slate-600">Tingkatkan keamanan akun Anda</p>
                </div>
              </div>

              <form onSubmit={handleSavePassword} className="space-y-6">
                <PasswordInput
                  label="Password Lama"
                  required
                  value={oldPass}
                  show={show.old}
                  onToggle={() => setShow({ ...show, old: !show.old })}
                  onChange={setOldPass}
                  placeholder="Masukkan password lama"
                />

                <PasswordInput
                  label="Password Baru"
                  required
                  value={newPass}
                  show={show.new}
                  onToggle={() => setShow({ ...show, new: !show.new })}
                  onChange={setNewPass}
                  placeholder="Masukkan password baru"
                />

                <PasswordInput
                  label="Konfirmasi Password Baru"
                  required
                  value={confirmPass}
                  show={show.confirm}
                  onToggle={() => setShow({ ...show, confirm: !show.confirm })}
                  onChange={setConfirmPass}
                  placeholder="Ulangi password baru"
                />

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Perbarui Password
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  ) // << penutup return
} // << penutup komponen PengaturanPage

/* ==== Sub Components ==== */
function InputField({
  label,
  icon,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string
  icon: ReactNode
  value?: string
  onChange: (val: string) => void
  required?: boolean
  type?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-emerald-600">
          {icon}
        </div>
        <Input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="pl-12 py-6 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white hover:border-slate-300"
        />
      </div>
    </div>
  )
}

function PasswordInput({
  label,
  value,
  onChange,
  required,
  show,
  onToggle,
  placeholder,
}: {
  label: string
  value?: string
  onChange: (val: string) => void
  required?: boolean
  show: boolean
  onToggle: () => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-emerald-600">
          <Lock className="h-5 w-5 text-slate-400" />
        </div>
        <Input
          type={show ? "text" : "password"}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="pl-12 pr-12 py-6 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white hover:border-slate-300"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1 rounded-lg hover:bg-emerald-50"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
