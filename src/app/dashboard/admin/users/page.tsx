"use client";

import { useEffect, useState } from "react";
import { usersAPI } from "@/lib/api";
import AddUserModal from "@/components/dashboard/users/add-user-modal";
import EditUserModal from "@/components/dashboard/users/edit-user-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Search } from "lucide-react";

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
  const [filteredRows, setFilteredRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState<Row | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  async function load() {
    setLoading(true);
    try {
      const result = await usersAPI.list();
      const data = result.data || [];
      setRows(data);
      setFilteredRows(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Search handler
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter(
        (r) =>
          r.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRows(filtered);
    }
    setCurrentPage(1); // Reset ke halaman 1 saat search
  }, [searchQuery, rows]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, endIndex);

  // Delete handler
  async function handleDelete(id: number, nama: string) {
    if (!confirm(`Apakah Anda yakin ingin menghapus user "${nama}"?`)) return;
    
    try {
      await usersAPI.delete(id);
      alert("User berhasil dihapus");
      load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal menghapus user");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Manajemen Akun & Peran</h1>
        <Button onClick={() => setShowAdd(true)} className="bg-green-600 hover:bg-green-700">
          + Tambah User
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari nama, username, atau email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Nama</th>
              <th className="text-left p-3">Username</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Nomor Telepon</th>
              <th className="text-left p-3">Role</th>
              <th className="text-center p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3 text-center" colSpan={6}>
                  Memuat...
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td className="p-3 text-center" colSpan={6}>
                  {searchQuery ? "Tidak ada hasil pencarian" : "Belum ada data user"}
                </td>
              </tr>
            ) : (
              currentRows.map((r) => (
                <tr key={r.id} className="border-t hover:bg-muted/50">
                  <td className="p-3">{r.nama}</td>
                  <td className="p-3">{r.username}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.nomor_telepon || "-"}</td>
                  <td className="p-3 capitalize">{r.role}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditUser(r)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(r.id, r.nama)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredRows.length)} dari{" "}
            {filteredRows.length} user
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-green-600" : ""}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAdd && <AddUserModal onCreated={load} onClose={() => setShowAdd(false)} />}
      {editUser && (
        <EditUserModal
          user={editUser}
          onUpdated={load}
          onClose={() => setEditUser(null)}
        />
      )}
    </div>
  );
}