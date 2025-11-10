"use client";

import { useEffect, useRef, useState } from "react";
import { usersAPI } from "@/lib/api";
import { X, AlertCircle, Eye, EyeOff, ChevronsUpDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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

  // Validators
  const isGmail = (v: string) => /^[a-z0-9._%+-]+@gmail\.com$/i.test(v.trim());
  const strongPass = (v: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(v);
  const validPhone = (v: string) => /^08\d{8,11}$/.test(v.trim()); // 08 + (8–11) digit = 10–13 digit

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

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

    // ✅ Email wajib @gmail.com
    if (!isGmail(form.email)) {
      setWarn({
        open: true,
        title: "Email Tidak Valid",
        message: "Gunakan alamat email @gmail.com.",
      });
      return;
    }

    // ✅ Password kuat (min 8, huruf kecil, huruf besar, angka, simbol)
    if (!strongPass(form.password)) {
      setWarn({
        open: true,
        title: "Password Lemah",
        message:
          "Password minimal 8 karakter dan harus mengandung huruf kecil, huruf besar, angka, dan karakter khusus.",
      });
      return;
    }

    // ✅ Nomor telepon 08xxxxxxxx (10–13 digit)
    if (!validPhone(form.nomor_telepon)) {
      setWarn({
        open: true,
        title: "Nomor Telepon Tidak Valid",
        message: "Nomor telepon harus dimulai dari 08 dan berjumlah 10–13 digit.",
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
      const res = e?.response;
      let msg =
        res?.data?.errors?.username?.[0] ||
        res?.data?.errors?.email?.[0] ||
        res?.data?.errors?.nama?.[0] ||
        res?.data?.message ||
        "Gagal membuat akun";

      // Normalisasi pesan agar jelas
      if (typeof msg === "string") {
        if (/username/i.test(msg)) msg = "Username sudah digunakan. Silakan pilih yang lain.";
        else if (/email/i.test(msg)) msg = "Email sudah digunakan. Gunakan email lain.";
        else if (/nama/i.test(msg)) msg = "Nama sudah digunakan.";
      }
      if (res?.status === 409) msg = "Data sudah terdaftar.";

      // tampilkan popup hijau yang sudah ada
      setWarn({ open: true, title: "Tidak Dapat Membuat Akun", message: String(msg) });
      toast.error(String(msg)); // opsional, biar tetap ada toast
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
              placeholder="email@gmail.com"
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-between gap-3 px-4 py-3.5 border-2 rounded-xl text-sm
                            bg-white/90 backdrop-blur-sm border-emerald-200 hover:border-emerald-400
                            focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                  aria-label="Pilih role"
                >
                  <span className="truncate text-gray-900">
                    {form.role === "nakes"
                      ? "Tenaga Kesehatan (Nakes)"
                      : form.role.charAt(0).toUpperCase() + form.role.slice(1)}
                  </span>
                  <ChevronsUpDown className="w-4 h-4 opacity-70" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)] p-1 rounded-xl border-2
                          border-emerald-200 bg-white/95 backdrop-blur-md shadow-xl"
              >
                <DropdownMenuItem
                  className="rounded-lg px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer"
                  onClick={() => setForm({ ...form, role: "admin" })}
                >
                  <span className="inline-flex items-center gap-2">
                    {form.role === "admin" ? <Check className="w-4 h-4" /> : <span className="w-4 h-4" />}
                    Admin
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="rounded-lg px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer"
                  onClick={() => setForm({ ...form, role: "manajemen" })}
                >
                  <span className="inline-flex items-center gap-2">
                    {form.role === "manajemen" ? <Check className="w-4 h-4" /> : <span className="w-4 h-4" />}
                    Manajemen
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="rounded-lg px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer"
                  onClick={() => setForm({ ...form, role: "nakes" })}
                >
                  <span className="inline-flex items-center gap-2">
                    {form.role === "nakes" ? <Check className="w-4 h-4" /> : <span className="w-4 h-4" />}
                    Tenaga Kesehatan (Nakes)
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <p className="text-xs text-gray-500">Pilih peran untuk menentukan akses.</p>
          </div>

          {/* Password + Konfirmasi */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-900">
                Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-11 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                  placeholder="(Wajib Diisi)"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute inset-y-0 right-3 grid place-items-center"
                >
                  {showPwd ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-900">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPwd2 ? "text" : "password"}
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  className="w-full px-4 py-3 pr-11 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                  placeholder="(Wajib Diisi)"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd2((v) => !v)}
                  className="absolute inset-y-0 right-3 grid place-items-center"
                >
                  {showPwd2 ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
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
