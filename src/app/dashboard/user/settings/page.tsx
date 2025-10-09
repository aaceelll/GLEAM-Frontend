"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Settings, User, Lock, Eye, EyeOff, Save, CheckCircle2, AlertCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PersonalInfoForm } from "@/components/forms/personal-info-form";

export default function SettingsPage() {
  const router = useRouter();
  
  // Tab state
  const [activeTab, setActiveTab] = React.useState<"profile" | "security">("profile");
  
  // User data
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  // Password states
  const [oldPass, setOldPass] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [show, setShow] = React.useState({ old: false, new: false, confirm: false });
  
  // Message state
  const [msg, setMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadUserData = async () => {
    try {
      const response = await api.get("/profile");
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to load user data:", error);
      setMsg({ type: "error", text: "Gagal memuat data pengguna." });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadUserData();
  }, []);

  const handleComplete = () => {
    loadUserData();
    setMsg({ type: "success", text: "Profil berhasil diperbarui." });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
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
      await api.patch("/profile/password", {
        old_password: oldPass,
        new_password: newPass,
        new_password_confirmation: confirmPass,
      });

      setMsg({ type: "success", text: "Password berhasil diperbarui." });
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      const resData = err?.response?.data;
      const errors = resData?.errors;
      const first = errors ? Object.values(errors)[0] : undefined;
      const firstMsg = Array.isArray(first) ? first[0] : first;
      const text = (firstMsg as string) || resData?.message || "Gagal memperbarui password.";
      setMsg({ type: "error", text });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-emerald-700">Memuat...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-red-600">Gagal memuat data pengguna.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header with floating animation */}
        <header className="mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Settings className="h-8 w-8 text-white animate-pulse" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Pengaturan
              </h1>
              <p className="text-base md:text-lg text-gray-600 font-medium">Kelola Profil dan Keamanan Akun Anda</p>
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

        {/* Navigation Pills - Sama persis kayak admin */}
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
        {activeTab === "profile" && (
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

              <PersonalInfoForm
                onComplete={handleComplete}
                initialData={user}
                isEditMode={true}
              />
            </div>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
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
                {/* Password Lama */}
                <PasswordInput
                  label="Password Lama"
                  required
                  value={oldPass}
                  show={show.old}
                  onToggle={() => setShow({ ...show, old: !show.old })}
                  onChange={setOldPass}
                  placeholder="Masukkan password lama"
                />

                {/* Password Baru */}
                <PasswordInput
                  label="Password Baru"
                  required
                  value={newPass}
                  show={show.new}
                  onToggle={() => setShow({ ...show, new: !show.new })}
                  onChange={setNewPass}
                  placeholder="Masukkan password baru"
                />

                {/* Konfirmasi Password Baru */}
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
        )}
      </div>
    </div>
  );
}

/* ==== Sub Component: Password Input ==== */
function PasswordInput({
  label,
  required,
  value,
  show,
  onToggle,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Lock className="h-5 w-5 text-slate-400" />
        </div>
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-12 pr-12 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl transition-colors"
          required={required}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}