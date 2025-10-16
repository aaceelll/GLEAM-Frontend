"use client";

import { useEffect, useRef, useState } from "react";
import { usersAPI } from "@/lib/api";
import { X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type Props = {
  onCreated: () => void;
  onClose: () => void;
};

type Role = "admin" | "manajemen" | "nakes" | "user";

export default function AddUserModal({ onCreated, onClose }: Props) {
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // modal peringatan validasi (warna diselaraskan hijau)
  const [warn, setWarn] = useState<{ open: boolean; title: string; message: string }>({
    open: false,
    title: "",
    message: "",
  });

  const [form, setForm] = useState({
    nama: "",
    username: "",
    email: "",
    nomor_telepon: "",
    role: "admin" as Role,
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cardRef.current?.querySelector<HTMLInputElement>('input[name="nama"]')?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  async function submit() {
    if (
      !form.nama.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.nomor_telepon.trim() ||
      !form.password ||
      !form.password_confirmation
    ) {
      setWarn({
        open: true,
        title: "Data Tidak Lengkap",
        message: "Lengkapi semua field bertanda merah sebelum menyimpan.",
      });
      return;
    }

    if (form.password !== form.password_confirmation) {
      setWarn({
        open: true,
        title: "Konfirmasi Password Salah",
        message: "Password dan konfirmasi password harus sama.",
      });
      return;
    }

    try {
      setSaving(true);
      const payload: any = {
        nama: form.nama.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
        nomor_telepon: form.nomor_telepon.trim() || undefined,
        role: form.role,
      };
      await usersAPI.create(payload);
      toast.success("Akun berhasil dibuat");
      onCreated();
      onClose();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        (e?.response?.data?.errors && Object.values(e.response.data.errors).flat()[0]) ||
        "Gagal membuat akun";
      toast.error(String(msg));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" onKeyDown={(e) => e.stopPropagation()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={cardRef}
        className="relative bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header hijau */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Tambah User</h2>
            <p className="text-emerald-100 text-sm mt-1">Buat akun staff baru</p>
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
            <label className="text-sm font-semibold text-gray-900">
              Nama <span className="text-red-500">*</span>
            </label>
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
            <label className="text-sm font-semibold text-gray-900">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
              placeholder="username"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-900">
              Email <span className="text-red-500">*</span>
            </label>
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
            <label className="text-sm font-semibold text-gray-900">
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <input
              value={form.nomor_telepon}
              onChange={(e) => setForm({ ...form, nomor_telepon: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-900">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
            >
              <option value="admin">Admin</option>
              <option value="manajemen">Manajemen</option>
              <option value="nakes">Nakes</option>

            </select>
          </div>

          {/* Password + Konfirmasi */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-900">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                placeholder="******"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-900">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                placeholder="******"
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

      {/* === Popup Peringatan Validasi — tema hijau === */}
      {warn.open && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4" onMouseDown={(e) => e.stopPropagation()}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header & icon hijau */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 flex gap-3 items-start">
              <div className="mt-0.5">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h3 className="font-bold text-lg">{warn.title}</h3>
                <p className="text-white/90 text-sm mt-1">{warn.message}</p>
              </div>
            </div>
            {/* CTA hijau */}
            <div className="p-5">
              <button
                onClick={() => setWarn({ ...warn, open: false })}
                className="w-full h-11 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
