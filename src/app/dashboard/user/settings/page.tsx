"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PersonalInfoForm } from "@/components/forms/personal-info-form";
import { api } from "@/lib/api";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const loadUserData = async () => {
    try {
      const response = await api.get("/profile");
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadUserData();
  }, []);

  const handleComplete = () => {
    router.push("/dashboard/user");
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
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 grid place-items-center shadow">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Pengaturan</h1>
            <p className="text-gray-600 mt-0.5">Kelola informasi pribadi & preferensi akun Anda</p>
          </div>
        </header>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <h2 className="text-xl font-bold text-gray-900">Informasi Akun</h2>
          </div>
          <div className="px-6 py-6">
            <PersonalInfoForm
              onComplete={handleComplete}
              initialData={user}
              isEditMode={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
