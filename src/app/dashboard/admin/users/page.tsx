"use client";

import { useEffect, useState } from "react";
import { usersAPI } from "@/lib/api";
import AddUserModal from "@/components/dashboard/users/add-user-modal";
import { Button } from "@/components/ui/button";

type Row = {
  id: number;
  nama: string;
  username: string;
  email: string;
  nomor_telepon?: string;
  role: "admin" | "manajemen" | "nakes" | "user";
};

export default function UsersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await usersAPI.list();
      setRows(data.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Manajemen Akun & Peran</h1>
        <Button onClick={() => setShowAdd(true)}>+ Tambah User</Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Nama</th>
              <th className="text-left p-3">Username</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Nomor Telepon</th>
              <th className="text-left p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={5}>Memuat...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="p-3" colSpan={5}>Belum ada data user</td></tr>
            ) : rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.nama}</td>
                <td className="p-3">{r.username}</td>
                <td className="p-3">{r.email}</td>
                <td className="p-3">{r.nomor_telepon || "-"}</td>
                <td className="p-3 capitalize">{r.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <AddUserModal
          onCreated={load}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
