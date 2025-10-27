"use client";

import { useEffect, useState } from "react";
import { usersAPI } from "@/lib/api";
import AddUserModal from "@/components/dashboard/users/add-user-modal";
import EditUserModal from "@/components/dashboard/users/edit-user-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Search, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Row = {
  id: number;
  nama: string;
  username: string;
  email: string;
  nomor_telepon?: string;
  role: "admin" | "manajemen" | "nakes" | "user";
};

const roleColors: Record<Row["role"], string> = {
  admin: "bg-red-100 text-red-700 border-red-200",
  manajemen: "bg-blue-100 text-blue-700 border-blue-200",
  nakes: "bg-purple-100 text-purple-700 border-purple-200",
  user: "bg-gray-100 text-gray-700 border-gray-200",
};

const roleLabels: Record<Row["role"], string> = {
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

  // AlertDialog delete
  const [toDelete, setToDelete] = useState<Row | null>(null);

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  function blurSearch() {
    const el = document.getElementById("admin-users-search") as HTMLInputElement | null;
    el?.blur();
  }

  async function load() {
    setLoading(true);
    try {
      const result = await usersAPI.list();
      const data: Row[] = result.data || [];
      setRows(data);
      setFilteredRows(data);
    } catch {
      toast.error("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const handler = (e: PageTransitionEvent) => {
      // @ts-ignore
      if (e.persisted) setSearchQuery("");
    };
    window.addEventListener("pageshow", handler as any);
    return () => window.removeEventListener("pageshow", handler as any);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRows(rows);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredRows(
        rows.filter(
          (r) =>
            r.nama.toLowerCase().includes(q) ||
            r.username.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q)
        )
      );
    }
    setCurrentPage(1);
  }, [searchQuery, rows]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, endIndex);

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await usersAPI.delete(toDelete.id);
      toast.success("User berhasil dihapus");
      setToDelete(null);
      load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal menghapus user");
    }
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
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

             {/* Judul + subjudul */}
            <div>
              <h1 className="text-[22px] leading-[1.15] sm:text-3xl md:text-4xl font-bold text-gray-800">
                Manajemen Akun dan Peran<br className="hidden sm:block" />
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-0.5">
                Kelola Akun Staff
              </p>
            </div>
          </div>
        </div>
          <button
            onClick={() => setShowAdd(true)}
            className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold"
          >
            <UserPlus className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            Tambah Akun
          </button>
  

        {/* Card + Search + Table */}
        <section>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                    Daftar Akun
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 ml-4">Kelola Akun Pengguna GLEAM</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="px-6 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="admin-users-search"
                  type="text"
                  name="admin-users-search"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="Cari nama, username, atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="px-3 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
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
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                            <p className="text-sm font-medium">Memuat data...</p>
                          </div>
                        </td>
                      </tr>
                    ) : currentRows.length === 0 ? (
                      <tr>
                        <td className="p-8 text-center text-gray-500" colSpan={6}>
                          {searchQuery ? (
                            <div className="py-8">
                              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                                <Search className="h-8 w-8 text-gray-400" />
                              </div>
                              <p className="text-gray-700 font-bold">Tidak ada hasil pencarian</p>
                              <p className="text-sm text-gray-500 mt-1">Coba kata kunci lain</p>
                            </div>
                          ) : (
                            <div className="py-8">
                              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                                <Users className="h-8 w-8 text-gray-400" />
                              </div>
                              <p className="text-gray-700 font-bold">Belum ada data user</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Klik tombol &quot;Tambah Akun&quot; untuk memulai
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : (
                      currentRows.map((r, idx) => (
                        <tr
                          key={r.id}
                          className={`border-b border-gray-100 hover:bg-emerald-50/50 transition-colors ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
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
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${roleColors[r.role]}`}
                            >
                              {roleLabels[r.role]}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setEditUser(r)}
                                className="p-2.5 rounded-xl text-amber-600 bg-amber-50 hover:bg-gradient-to-br hover:from-amber-500 hover:to-orange-500 hover:text-white transition-all hover:scale-110 shadow-sm"
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setToDelete(r)}
                                className="p-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-500 hover:text-white transition-all hover:scale-110 shadow-sm"
                                title="Hapus"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
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
              <div className="px-6 pb-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-100 rounded-2xl p-4">
                  <p className="text-sm text-gray-600">
                    Menampilkan{" "}
                    <span className="font-medium text-gray-900">
                      {startIndex + 1}-{Math.min(endIndex, filteredRows.length)}
                    </span>{" "}
                    dari{" "}
                    <span className="font-medium text-gray-900">
                      {filteredRows.length}
                    </span>{" "}
                    user
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-gray-300 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 rounded-xl"
                    >
                      Sebelumnya
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page: number;
                      if (totalPages <= 5) page = i + 1;
                      else if (currentPage <= 3) page = i + 1;
                      else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                      else page = currentPage - 2 + i;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md"
                              : "border-gray-300 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl"
                          }
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
                      className="border-gray-300 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 rounded-xl"
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modals */}
      {showAdd && (
        <AddUserModal
          onCreated={async () => {
            await load();
          }}
          onClose={() => {
            setShowAdd(false);
            setTimeout(blurSearch, 0); // pastikan search tidak fokus lagi
          }}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onUpdated={async () => {
            await load();
          }}
          onClose={() => {
            setEditUser(null);
            setTimeout(blurSearch, 0);
          }}
        />
      )}

      {/* Confirm Delete */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="rounded-3xl p-0 overflow-hidden">
          <AlertDialogHeader className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 grid place-items-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <AlertDialogTitle className="text-lg font-bold">Hapus Akun?</AlertDialogTitle>
            </div>
          </AlertDialogHeader>

          <div className="px-6 py-4 border-b border-gray-100">
            <AlertDialogDescription className="text-gray-600">
              Apakah Anda yakin ingin menghapus akun{" "}
              <b className="text-gray-900">“{toDelete?.nama}”</b>? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </div>

          <AlertDialogFooter className="px-6 py-4">
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
