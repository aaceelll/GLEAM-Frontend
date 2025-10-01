"use client";

import { useState } from "react";
import { usersAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, UserCog, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";

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
  const [form, setForm] = useState({
    nama: user.nama,
    username: user.username,
    email: user.email,
    nomor_telepon: user.nomor_telepon || "",
    password: "",
    role: user.role,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload: any = {
        nama: form.nama,
        username: form.username,
        email: form.email,
        nomor_telepon: form.nomor_telepon,
        role: form.role,
      };
      if (form.password.trim()) payload.password = form.password;

      await usersAPI.update(user.id, payload);
      toast.success("User berhasil diupdate");
      onUpdated();
      onClose();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Gagal mengupdate user";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
         onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <UserCog className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit User</h2>
              <p className="text-green-100 text-sm mt-0.5">Perbarui informasi user yang dipilih</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Terjadi Kesalahan</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Nama */}
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Nama <span className="text-red-500 text-base">*</span>
            </Label>
            <Input
              id="nama"
              required
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Username <span className="text-red-500 text-base">*</span>
            </Label>
            <Input
              id="username"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Email <span className="text-red-500 text-base">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Nomor Telepon */}
          <div className="space-y-2">
            <Label htmlFor="nomor_telepon" className="text-sm font-medium text-gray-700">Nomor Telepon</Label>
            <Input
              id="nomor_telepon"
              value={form.nomor_telepon}
              onChange={(e) => setForm({ ...form, nomor_telepon: e.target.value })}
              placeholder="08xx xxxx xxxx"
              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Password Baru */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password Baru</Label>
            <Input
              id="password"
              type="password"
              placeholder="Kosongkan jika tidak ingin mengubah"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">Minimal 6 karakter. Kosongkan jika tidak ingin mengubah password.</p>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Role <span className="text-red-500 text-base">*</span>
            </Label>
            <Select value={form.role} onValueChange={(v: any) => setForm({ ...form, role: v })}>
              <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manajemen">Manajemen</SelectItem>
                <SelectItem value="nakes">Nakes</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 hover:bg-gray-100" disabled={submitting}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700 min-w-[110px]">
              {submitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
