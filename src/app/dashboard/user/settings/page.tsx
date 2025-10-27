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
    <div className="min-h-screen bg-white px-6 md:px-10 py-9">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* ICON CHIP – versi responsif */}
            <div className="relative isolate shrink-0">
              <span
                aria-hidden
                className="absolute -inset-1.5 sm:-inset-2 rounded-2xl bg-gradient-to-br from-emerald-400/25 to-teal-500/25 blur-lg -z-10"
              />
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

             {/* Judul + subjudul */}
            <div>
              <h1 className="text-[22px] leading-[1.15] sm:text-3xl md:text-4xl font-bold text-gray-800">
                Pengaturan<br className="hidden sm:block" />
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-0.5">
                Kelola Profil dan Keamanan Akun Anda
              </p>
            </div>
          </div>
        </div>

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

        {/* Navigation Pills (sejajar, compact, proporsional) */}
        <div
          className="
            grid grid-cols-3 gap-2 sm:gap-3
            bg-white rounded-2xl border-2 border-gray-100 shadow-md
            p-1 sm:p-2
          "
        >
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center justify-center gap-1.5 
              rounded-xl font-semibold transition-all duration-200
              text-xs sm:text-sm md:text-base py-2 sm:py-2.5
              ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.03]"
                  : "text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 hover:shadow-md"
              }`}
          >
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Profil Saya</span>
          </button>

          <button
            onClick={() => setActiveTab("location")}
            className={`flex items-center justify-center gap-1.5 
              rounded-xl font-semibold transition-all duration-200
              text-xs sm:text-sm md:text-base py-2 sm:py-2.5
              ${
                activeTab === "location"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.03]"
                  : "text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 hover:shadow-md"
              }`}
          >
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Lokasi</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center justify-center gap-1.5 
              rounded-xl font-semibold transition-all duration-200
              text-xs sm:text-sm md:text-base py-2 sm:py-2.5
              ${
                activeTab === "security"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.03]"
                  : "text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 hover:shadow-md"
              }`}
          >
            <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Keamanan</span>
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
              <div className="flex justify-center pt-4 border-t-2 border-gray-100">
                <button
                  onClick={handleSaveLocation}
                  disabled={savingLocation || !kelurahan || !rw}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  {savingLocation ? "Menyimpan..." : "Simpan Lokasi"}
                </button>
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

                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Save className="h-5 w-5" />
                    Perbarui Password
                  </button>
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