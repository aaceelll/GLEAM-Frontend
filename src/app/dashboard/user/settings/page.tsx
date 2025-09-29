"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PersonalInfoForm } from "@/components/forms/personal-info-form";
import { api } from "@/lib/api";

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
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <p className="text-emerald-600">Memuat...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <p className="text-red-600">Gagal memuat data pengguna.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl">
          <div className="border-b border-emerald-100 px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-emerald-700">Pengaturan</h1>
            <p className="text-gray-600 mt-2">
              Kelola informasi pribadi dan preferensi akun Anda
            </p>
          </div>

          <div className="p-6 lg:p-8">
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