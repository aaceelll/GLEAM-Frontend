"use client";

import { useState } from "react";
import { usersAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, UserPlus, AlertCircle } from "lucide-react";

type Props = {
  onCreated: () => void;
  onClose: () => void;
};

export default function AddUserModal({ onCreated, onClose }: Props) {
  const [form, setForm] = useState({
    nama: "",
    username: "",
    email: "",
    nomor_telepon: "",
    password: "",
    role: "admin" as "admin" | "manajemen" | "nakes",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    try {
      setSaving(true);
      await usersAPI.create(form);
      onCreated();
      onClose();
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Gagal menyimpan user";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Tambah User Baru</h2>
              <p className="text-green-100 text-sm mt-0.5">Isi formulir di bawah untuk menambah user</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Terjadi Kesalahan</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid gap-4">
            {/* Nama */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Nama <span className="text-red-500 text-base">*</span>
              </Label>
              <Input 
                value={form.nama} 
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Masukkan nama lengkap"
                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Username <span className="text-red-500 text-base">*</span>
              </Label>
              <Input 
                value={form.username} 
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Masukkan username"
                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Email <span className="text-red-500 text-base">*</span>
              </Label>
              <Input 
                type="email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contoh@email.com"
                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Nomor Telepon */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Nomor Telepon
              </Label>
              <Input 
                value={form.nomor_telepon} 
                onChange={(e) => setForm({ ...form, nomor_telepon: e.target.value })}
                placeholder="08xx xxxx xxxx"
                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Password <span className="text-red-500 text-base">*</span>
              </Label>
              <Input 
                type="password" 
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimal 8 karakter"
                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Role <span className="text-red-500 text-base">*</span>
              </Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v as any })}
              >
                <SelectTrigger className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="manajemen">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Manajemen
                    </div>
                  </SelectItem>
                  <SelectItem value="nakes">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Nakes
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Required Fields Note */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-red-500 text-base">*</span>
            <span className="text-xs text-gray-500">Wajib diisi</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-100"
              disabled={saving}
            >
              Batal
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all min-w-[100px]"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Simpan
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}