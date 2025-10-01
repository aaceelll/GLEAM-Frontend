"use client";

import { useEffect, useState } from "react";
import { usersAPI } from "@/lib/api";
import AddUserModal from "@/components/dashboard/users/add-user-modal";
import EditUserModal from "@/components/dashboard/users/edit-user-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Search, UserPlus, Users } from "lucide-react";

type Row = {
  id: number;
  nama: string;
  username: string;
  email: string;
  nomor_telepon?: string;
  role: "admin" | "manajemen" | "nakes" | "user";
};

const roleColors = {
  admin: "bg-red-100 text-red-700 border-red-200",
  manajemen: "bg-blue-100 text-blue-700 border-blue-200",
  nakes: "bg-purple-100 text-purple-700 border-purple-200",
  user: "bg-gray-100 text-gray-700 border-gray-200",
};

const roleLabels = {
  admin: "Admin",
  manajemen: "Manajemen",
  nakes: "Nakes",
  user: "User",
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
    setCurrentPage(1);
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
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent">
          Manajemen Akun dan Peran
        </h1>
        <p className="text-gray-600 mt-0.5">Kelola Akun Staff</p>
      </div>

        <Button 
          onClick={() => setShowAdd(true)} 
          className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Tambah User
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Cari nama, username, atau email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 shadow-sm"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Nama</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Username</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Nomor Telepon</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-center p-4 text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-8 text-center text-gray-500" colSpan={6}>
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td className="p-8 text-center text-gray-500" colSpan={6}>
                    {searchQuery ? (
                      <div>
                        <p className="font-medium">Tidak ada hasil pencarian</p>
                        <p className="text-sm mt-1">Coba kata kunci lain</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Belum ada data user</p>
                        <p className="text-sm mt-1">Klik tombol "Tambah User" untuk memulai</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                currentRows.map((r, idx) => (
                  <tr 
                    key={r.id} 
                    className={`border-b border-gray-100 hover:bg-green-50/50 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{r.nama}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700">{r.username}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-600 text-sm">{r.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-600">{r.nomor_telepon || "-"}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${roleColors[r.role]}`}>
                        {roleLabels[r.role]}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditUser(r)}
                          className="h-9 w-9 p-0 border-gray-300 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(r.id, r.nama)}
                          className="h-9 w-9 p-0 border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-medium text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredRows.length)}</span> dari{" "}
            <span className="font-medium text-gray-900">{filteredRows.length}</span> user
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-gray-300 hover:bg-green-50 disabled:opacity-50"
            >
              Sebelumnya
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-green-600 hover:bg-green-700" : "border-gray-300 hover:bg-green-50"}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-gray-300 hover:bg-green-50 disabled:opacity-50"
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