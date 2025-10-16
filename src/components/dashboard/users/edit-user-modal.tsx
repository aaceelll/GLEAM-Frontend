"use client";

import { useEffect, useRef, useState } from "react";
import { usersAPI } from "@/lib/api";
import { X } from "lucide-react";
import { toast } from "sonner";

type User = {
  id: number;
  nama: string;
  username: string;
  email: string;
  nomor_telepon?: string;
  role: "admin" | "manajemen" | "nakes" | "user";
};

type Props = {
  user: User;
  onUpdated: () => void;
  onClose: () => void;
};

export default function EditUserModal({ user, onUpdated, onClose }: Props) {
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    nama: user.nama,
    username: user.username,
    email: user.email,
    nomor_telepon: user.nomor_telepon || "",
    role: user.role,
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    // Lock scroll & trap focus
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cardRef.current?.querySelector<HTMLInputElement>('input[name="nama"]')?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  async function submit() {
    if (!form.nama.trim() || !form.username.trim() || !form.email.trim()) {
      toast.error("Lengkapi semua field wajib.");
      return;
    }
    if (form.password || form.password_confirmation) {
      if (form.password !== form.password_confirmation) {
        toast.error("Konfirmasi password tidak cocok.");
        return;
      }
    }

    try {
      setSaving(true);
      await usersAPI.update(user.id, {
        nama: form.nama.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        nomor_telepon: form.nomor_telepon?.trim() || undefined,
        role: form.role,
        ...(form.password
          ? {
              password: form.password,
              password_confirmation: form.password_confirmation,
            }
          : {}),
      });
      toast.success("Perubahan tersimpan");
      onUpdated();
      onClose();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        (e?.response?.data?.errors && Object.values(e.response.data.errors).flat()[0]) ||
        "Gagal memperbarui akun";
      toast.error(String(msg));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={cardRef}
        className="relative bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header hijau */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit User</h2>
            <p className="text-emerald-100 text-sm mt-1">Perbarui data akun</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300"
            aria-label="Tutup"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Nama */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-900">Nama</label>
            <input
              name="nama"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
              placeholder="Nama lengkap"
            />
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-900">Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
              placeholder="username"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-900">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
              placeholder="email@contoh.com"
            />
          </div>

          {/* Nomor Telepon */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-900">Nomor Telepon</label>
            <input
              value={form.nomor_telepon}
              onChange={(e) => setForm({ ...form, nomor_telepon: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-900">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
            >
              <option value="admin">Admin</option>
              <option value="manajemen">Manajemen</option>
              <option value="nakes">Nakes</option>
              {/* <option value="user">User</option> */}
            </select>
          </div>

          {/* Password Opsional */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-900">Password Baru</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                placeholder="(opsional)"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-900">Konfirmasi Password Baru</label>
              <input
                type="password"
                value={form.password_confirmation}
                onChange={(e) =>
                  setForm({ ...form, password_confirmation: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                placeholder="(opsional)"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold disabled:opacity-50 transition-all hover:scale-105"
            >
              Batal
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl py-3 font-semibold disabled:opacity-50 transition-all hover:scale-105 shadow-lg"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
