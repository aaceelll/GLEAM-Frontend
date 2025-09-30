// app/dashboard/admin/pengaturan/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Save, User, Lock, Mail, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

type ProfilePayload = {
  nama: string;
  email: string;
  username: string;
  nomor_telepon?: string;
};

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [profile, setProfile] = useState<ProfilePayload>({
    nama: "",
    email: "",
    username: "",
    nomor_telepon: "",
  });

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [show, setShow] = useState({ old: false, new: false, confirm: false });

  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user_data");
    if (raw) {
      const u = JSON.parse(raw);
      setProfile({
        nama: u?.nama ?? "",
        email: u?.email ?? "",
        username: u?.username ?? "",
        nomor_telepon: u?.nomor_telepon ?? "",
      });
    }
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      localStorage.setItem("user_data", JSON.stringify(profile));
      setMsg({ type: "success", text: "Profil berhasil diperbarui." });
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg({ type: "error", text: "Gagal menyimpan profil." });
    }
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!oldPass || !newPass || !confirmPass) {
      setMsg({ type: "error", text: "Semua field password wajib diisi." });
      return;
    }
    if (newPass !== confirmPass) {
      setMsg({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }

    try {
      setMsg({ type: "success", text: "Password berhasil diperbarui." });
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg({ type: "error", text: "Gagal memperbarui password." });
    }
  }

  return (
    <div className="px-6 md:px-10 py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Pengaturan Akun
          </h1>
        </header>

        {/* Notification */}
        {msg && (
          <div
            className={`rounded-2xl px-5 py-4 flex items-start gap-3 backdrop-blur-sm animate-in slide-in-from-top-2 ${
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
        <div className="flex gap-3 p-2 bg-white rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <User className="h-4 w-4" />
            Profil Saya
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === "security"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Lock className="h-4 w-4" />
            Keamanan
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card className="p-8 border rounded-2xl bg-white">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Informasi Profil</h2>
                  <p className="text-sm text-slate-600">Perbarui data pribadi Anda</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <InputField
                  label="Nama"
                  icon={<User className="h-5 w-5 text-slate-400" />}
                  required
                  value={profile.nama}
                  onChange={(v) => setProfile({ ...profile, nama: v })}
                  placeholder="Masukkan nama lengkap"
                />

                <InputField
                  label="Alamat Email"
                  icon={<Mail className="h-5 w-5 text-slate-400" />}
                  required
                  type="email"
                  value={profile.email}
                  onChange={(v) => setProfile({ ...profile, email: v })}
                  placeholder="nama@email.com"
                />

                <InputField
                  label="Username"
                  icon={<User className="h-5 w-5 text-slate-400" />}
                  required
                  value={profile.username}
                  onChange={(v) => setProfile({ ...profile, username: v })}
                  placeholder="username_anda"
                />

                <InputField
                  label="Nomor Telepon"
                  icon={<Phone className="h-5 w-5 text-slate-400" />}
                  value={profile.nomor_telepon}
                  onChange={(v) => setProfile({ ...profile, nomor_telepon: v })}
                  placeholder="+62 812 3456 7890"
                />

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 rounded-xl font-semibold transition-all duration-200"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <Card className="p-8 border rounded-2xl bg-white">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Ubah Password</h2>
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

                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                  <p className="text-sm text-blue-900 font-medium">
                    💡 Tips Keamanan: Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol untuk password yang lebih kuat.
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 rounded-xl font-semibold transition-all duration-200"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Perbarui Password
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

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
  label: string;
  icon: React.ReactNode;
  value?: string;
  onChange: (val: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold text-slate-900 flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          {icon}
        </div>
        <Input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="pl-12 py-6 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
        />
      </div>
    </div>
  );
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
  label: string;
  value?: string;
  onChange: (val: string) => void;
  required?: boolean;
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold text-slate-900 flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Lock className="h-5 w-5 text-slate-400" />
        </div>
        <Input
          type={show ? "text" : "password"}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="pl-12 pr-12 py-6 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}