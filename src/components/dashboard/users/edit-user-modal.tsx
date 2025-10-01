"use client"

import { useState, type FormEvent } from "react"
import { usersAPI } from "@/lib/api"
import { X, Pencil } from "lucide-react"
import { toast } from "sonner"

type User = {
  id: number
  nama: string
  username: string
  email: string
  nomor_telepon?: string
  role: "admin" | "manajemen" | "nakes" | "user"
}

type Props = {
  user: User
  onUpdated: () => void
  onClose: () => void
}

/** Payload yang dikirim ke API saat update.
 *  Password dibuat OPTIONAL supaya bisa di-skip saat kosong.
 */
type UpdateUserPayload = {
  nama: string
  username: string
  email: string
  password?: string
  nomor_telepon?: string
  role: User["role"]
}

export default function EditUserModal({ user, onUpdated, onClose }: Props) {
  const [formData, setFormData] = useState<UpdateUserPayload>({
    nama: user.nama,
    username: user.username,
    email: user.email,
    password: "", // opsional untuk edit: kosongkan jika tidak ubah
    nomor_telepon: user.nomor_telepon || "",
    role: user.role,
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!formData.nama.trim() || !formData.username.trim() || !formData.email.trim()) {
      toast.error("Nama, username, dan email wajib diisi")
      return
    }

    setLoading(true)
    try {
      // Bangun payload: hanya sertakan password jika diisi
      const { password, ...rest } = formData
      const payload: UpdateUserPayload =
        password && password.trim().length > 0 ? { ...rest, password: password.trim() } : rest

      await usersAPI.update(user.id, payload)
      toast.success("User berhasil diperbarui!")
      onUpdated()
      onClose()
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Gagal memperbarui user"
      toast.error(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Pencil className="h-6 w-6" />
              Edit User
            </h2>
            <p className="text-amber-100 text-sm mt-1">Perbarui informasi user</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Masukkan username"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-900 text-sm">Password Baru</label>
              <input
                type="password"
                value={formData.password ?? ""}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Kosongkan jika tidak ingin mengubah"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
              />
              <p className="text-xs text-gray-500">Kosongkan jika tidak ingin mengubah password</p>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-900 text-sm">Nomor Telepon</label>
              <input
                type="tel"
                value={formData.nomor_telepon ?? ""}
                onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as UpdateUserPayload["role"] })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
              >
                <option value="user">User</option>
                <option value="nakes">Nakes</option>
                <option value="manajemen">Manajemen</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold transition-all hover:scale-105"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl py-3 font-semibold transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : "💾 Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
