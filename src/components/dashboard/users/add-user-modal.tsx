"use client";

import { useState } from "react";
import { usersAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Tambah User Baru</h2>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="grid gap-3">
          <div>
            <Label>Nama *</Label>
            <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
          </div>
          <div>
            <Label>Username *</Label>
            <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label>Nomor Telepon</Label>
            <Input value={form.nomor_telepon} onChange={(e) => setForm({ ...form, nomor_telepon: e.target.value })} />
          </div>
          <div>
            <Label>Password *</Label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <Label>Role *</Label>
            <Select
              value={form.role}
              onValueChange={(v) => setForm({ ...form, role: v as any })}
            >
              <SelectTrigger><SelectValue placeholder="Pilih Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manajemen">Manajemen</SelectItem>
                <SelectItem value="nakes">Nakes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
        </div>
      </div>
    </div>
  );
}
