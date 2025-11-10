"use client";

import { useEffect, useRef, useState } from "react";
import { usersAPI } from "@/lib/api";
import { X, AlertCircle, Eye, EyeOff, ChevronsUpDown, Check } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"; 

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

  // modal peringatan
  const [warn, setWarn] = useState<{ open: boolean; title: string; message: string }>({
    open: false,
    title: "",
    message: "",
  });

  const [form, setForm] = useState({
    nama: user.nama,
    username: user.username,
    email: user.email,
    nomor_telepon: user.nomor_telepon || "",
    role: user.role,
    password: "",
    password_confirmation: "",
  });

  const [banner, setBanner] = useState<null | { type: "success"; text: string }>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  // Validators
  const isGmail = (v: string) => /^[a-z0-9._%+-]+@gmail\.com$/i.test(v.trim());
  const strongPass = (v: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(v);
  const validPhone = (v: string) => /^08\d{8,11}$/.test(v.trim());

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
    // Field wajib
    if (
      !form.nama.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.nomor_telepon.trim()
    ) {
      setWarn({
        open: true,
        title: "Data Tidak Lengkap",
        message: "Lengkapi semua field wajib.",
      });
      return;
    }

    // Email harus @gmail.com
    if (!isGmail(form.email)) {
      setWarn({
        open: true,
        title: "Email Tidak Valid",
        message: "Gunakan alamat email @gmail.com.",
      });
      return;
    }

    // No. telepon 08 + 10–13 digit
    if (!validPhone(form.nomor_telepon)) {
      setWarn({
        open: true,
        title: "Nomor Telepon Tidak Valid",
        message: "Nomor telepon harus diawali 08 dan berjumlah 10–13 digit.",
      });
      return;
    }

    // Password opsional; bila diisi harus lengkap, kuat, dan cocok konfirmasi
    if (form.password || form.password_confirmation) {
      if (!form.password || !form.password_confirmation) {
        setWarn({
          open: true,
          title: "Konfirmasi Password Wajib",
          message: "Jika ingin mengubah password, isi kedua kolom password dan konfirmasinya.",
        });
        return;
      }

      // sudah definisikan strongPass di atas:
         const strongPass = (v: string) =>
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(v);

      if (!strongPass(form.password)) {
        setWarn({
          open: true,
          title: "Password Lemah",
          message:
            "Password minimal 8 karakter dan harus mengandung huruf kecil, huruf besar, angka, dan karakter khusus.",
        });
        return;
      }

      if (form.password !== form.password_confirmation) {
        setWarn({
          open: true,
          title: "Konfirmasi Password Tidak Cocok",
          message: "Password baru dan konfirmasi password harus sama.",
        });
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
      const res = e?.response;
      const errs = res?.data?.errors || {};
      // tangkap pesan paling spesifik dari server
      let msg =
        errs.username?.[0] ||
        errs.email?.[0] ||
        errs.nomor_telepon?.[0] || // nama field umum di BE kamu
        errs.telepon?.[0] ||       // fallback jika BE pakai key lain
        res?.data?.message ||
        "Gagal memperbarui akun";

      // Normalisasi supaya jelas untuk user
      if (typeof msg === "string") {
        if (/username/i.test(msg)) msg = "Username sudah digunakan. Silakan pilih yang lain.";
        else if (/email/i.test(msg)) msg = "Email sudah digunakan. Gunakan email lain.";
        else if (/telepon|telp|nomor/i.test(msg)) msg = "Nomor telepon sudah digunakan.";
      }
      if (res?.status === 409) msg = "Data sudah terdaftar.";
      if (res?.status === 422 && typeof msg !== "string") msg = "Data tidak valid atau sudah dipakai.";

      // tampilkan modal peringatan
      setWarn({
        open: true,
        title: "Tidak Dapat Menyimpan Perubahan",
        message: String(msg),
      });
    } finally {
      setSaving(false);
    }
  }

  const isUser = user.role === "user";

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
              placeholder="email@gmail.com"
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
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              Role
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  disabled={isUser}
                  className={`w-full inline-flex items-center justify-between gap-3 px-4 py-3.5 border-2 rounded-xl text-sm
                    bg-white/90 backdrop-blur-sm
                    ${isUser ? "border-gray-200 text-gray-500 cursor-not-allowed"
                            : "border-emerald-200 hover:border-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"}`}
                  aria-label="Pilih role"
                >
                  <span className={`truncate ${isUser ? "text-gray-500" : "text-gray-900"}`}>
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
                          bg-white/95 backdrop-blur-md shadow-xl
                          border-emerald-200"
              >
                <button
                  type="button"
                  className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer"
                  onClick={() => setForm({ ...form, role: "admin" })}
                >
                  <span className="inline-flex items-center gap-2">
                    {form.role === "admin" ? <Check className="w-4 h-4" /> : <span className="w-4 h-4" />}
                    Admin
                  </span>
                </button>

                <button
                  type="button"
                  className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer"
                  onClick={() => setForm({ ...form, role: "manajemen" })}
                >
                  <span className="inline-flex items-center gap-2">
                    {form.role === "manajemen" ? <Check className="w-4 h-4" /> : <span className="w-4 h-4" />}
                    Manajemen
                  </span>
                </button>

                <button
                  type="button"
                  className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer"
                  onClick={() => setForm({ ...form, role: "nakes" })}
                >
                  <span className="inline-flex items-center gap-2">
                    {form.role === "nakes" ? <Check className="w-4 h-4" /> : <span className="w-4 h-4" />}
                    Tenaga Kesehatan (Nakes)
                  </span>
                </button>
              </DropdownMenuContent>
            </DropdownMenu>

            <p className="text-xs text-gray-500">Pilih peran untuk menentukan akses.</p>
          </div>

          {/* Password Opsional */}
          {!isUser && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-900">Password Baru</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 pr-11 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                    placeholder="(opsional)"
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
                <label className="text-sm font-semibold text-gray-900">Konfirmasi Password Baru</label>
                <div className="relative">
                  <input
                    type={showPwd2 ? "text" : "password"}
                    value={form.password_confirmation}
                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                    className="w-full px-4 py-3 pr-11 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                    placeholder="(opsional)"
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
          )}

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

      {/* WARN MODAL */}
      {warn.open && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center p-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 flex gap-3 items-start">
              <div className="mt-0.5">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h3 className="font-bold text-lg">{warn.title}</h3>
                <p className="text-white/90 text-sm mt-1">{warn.message}</p>
              </div>
            </div>
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
