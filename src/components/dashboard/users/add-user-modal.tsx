"use client"

import { useState, type FormEvent } from "react"
import { usersAPI } from "@/lib/api"
import { X, UserPlus } from "lucide-react"
import { toast } from "sonner"

type Props = {
  onCreated: () => void
  onClose: () => void
}

export default function AddUserModal({ onCreated, onClose }: Props) {
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    nomor_telepon: "",
    role: "user" as "admin" | "manajemen" | "nakes" | "user",
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!formData.nama.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error("Nama, username, email, dan password wajib diisi")
      return
    }

    setLoading(true)
    try {
      await usersAPI.create(formData)
      toast.success("User berhasil ditambahkan!")
      onCreated()
      onClose()
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Gagal menambahkan user"
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
              <UserPlus className="h-6 w-6" />
              Tambah User Baru
            </h2>
            <p className="text-green-100 text-sm mt-1">Lengkapi formulir di bawah</p>
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
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
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
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
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
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-900 text-sm">Nomor Telepon</label>
              <input
                type="tel"
                value={formData.nomor_telepon}
                onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as typeof formData.role })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
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
              {loading ? "Menyimpan..." : "💾 Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
