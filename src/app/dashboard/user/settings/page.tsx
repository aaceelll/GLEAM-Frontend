"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Settings, User, Lock, Eye, EyeOff, Save, CheckCircle2, AlertCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PersonalInfoForm } from "@/components/forms/personal-info-form";
import { LocationSelector } from "@/components/forms/location-selector";

export default function SettingsPage() {
  const router = useRouter();
  
  // Tab state
  const [activeTab, setActiveTab] = React.useState<"profile" | "location" | "security">("profile");
  
  // User data
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  
  // Location states
  const [kelurahan, setKelurahan] = React.useState("");
  const [rw, setRw] = React.useState("");
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [savingLocation, setSavingLocation] = React.useState(false);
  
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
      const userData = response.data.data;
      setUser(userData);
      
      // Load location data
      setKelurahan(userData.kelurahan || "");
      setRw(userData.rw || "");
      setLatitude(userData.latitude || "");
      setLongitude(userData.longitude || "");
      setAddress(userData.address || "");
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

  const handleLocationChange = (
    field: "kelurahan" | "rw" | "latitude" | "longitude" | "address",
    value: string
  ) => {
    if (field === "kelurahan") {
      setKelurahan(value);
      setRw(""); // Reset RW saat kelurahan berubah
    } else if (field === "rw") setRw(value);
    else if (field === "latitude") setLatitude(value);
    else if (field === "longitude") setLongitude(value);
    else if (field === "address") setAddress(value);
  };

  const handleSaveLocation = async () => {
    if (!kelurahan || !rw) {
      setMsg({ type: "error", text: "Mohon lengkapi Kelurahan dan RW" });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSavingLocation(true);
    setMsg(null);

    try {
      const response = await api.put("/profile", {
        kelurahan,
        rw,
        latitude: latitude || null,
        longitude: longitude || null,
        address: address || null,
      });

      setMsg({ type: "success", text: "✓ Lokasi berhasil diperbarui!" });
      setTimeout(() => setMsg(null), 3000);
      
      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem("user_data") || "{}");
      const updatedUser = { 
        ...currentUser, 
        kelurahan, 
        rw, 
        latitude, 
        longitude, 
        address 
      };
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error: any) {
      const resData = error?.response?.data;
      
      if (resData?.errors) {
        const errors = resData.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        setMsg({ type: "error", text: errorMessages });
      } else {
        const text = resData?.message || "Gagal menyimpan lokasi";
        setMsg({ type: "error", text });
      }
    } finally {
      setSavingLocation(false);
    }
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
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Gagal memuat data pengguna.</p>
        </div>
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
            onClick={() => setActiveTab("location")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-6 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === "location"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <MapPin className="h-5 w-5" />
            Lokasi
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

        {/* Location Tab */}
        {activeTab === "location" && (
          <Card className="p-8 border-2 border-gray-100 rounded-3xl bg-white shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b-2 border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Lokasi Tempat Tinggal</h2>
                  <p className="text-sm text-slate-600">Perbarui kelurahan dan RW tempat tinggal Anda</p>
                </div>
              </div>

              <LocationSelector
                kelurahan={kelurahan}
                rw={rw}
                latitude={latitude}
                longitude={longitude}
                address={address}
                onChange={handleLocationChange}
                required={false}
                showHeader={false}
                showMap={true}
              />

              {/* Info Box */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                <p className="text-sm text-emerald-800 flex items-start gap-2">
                  <span className="text-lg">ℹ️</span>
                  <span>
                    Data lokasi digunakan untuk monitoring kesehatan wilayah dan memudahkan 
                    koordinasi dengan tenaga kesehatan di kelurahan Anda.
                  </span>
                </p>
              </div>

              {/* Button Simpan Lokasi */}
              <div className="flex justify-end pt-4 border-t-2 border-gray-100">
                <Button
                  onClick={handleSaveLocation}
                  disabled={savingLocation || !kelurahan || !rw}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {savingLocation ? "Menyimpan..." : "Simpan Lokasi"}
                </Button>
              </div>
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
      <Label className="text-emerald-700 font-semibold">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 border-emerald-200 focus:border-emerald-500"
          required={required}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}