"use client";

import { useState } from "react";
import { usersAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

      // Hanya kirim password jika diisi
      if (form.password.trim()) {
        payload.password = form.password;
      }

      await usersAPI.update(user.id, payload);
      alert("User berhasil diupdate");
      onUpdated();
      onClose();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Gagal mengupdate user";
      setError(msg);
      console.error("Update error:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">Edit User</h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="nama">Nama *</Label>
            <Input
              id="nama"
              required
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="nomor_telepon">Nomor Telepon</Label>
            <Input
              id="nomor_telepon"
              value={form.nomor_telepon}
              onChange={(e) => setForm({ ...form, nomor_telepon: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="password">Password Baru</Label>
            <Input
              id="password"
              type="password"
              placeholder="Kosongkan jika tidak ingin mengubah"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimal 6 karakter. Kosongkan jika tidak ingin mengubah password.
            </p>
          </div>

          <div>
            <Label htmlFor="role">Role *</Label>
            <Select 
              value={form.role} 
              onValueChange={(v: any) => setForm({ ...form, role: v })}
            >
              <SelectTrigger>
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

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}