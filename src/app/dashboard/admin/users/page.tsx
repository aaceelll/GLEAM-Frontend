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
  const [banner, setBanner] = useState<null | { type: "success"; text: string }>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  useEffect(() => {
    if (errorBanner) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [errorBanner]);

  async function confirmDelete() {
  if (!toDelete) return;

  try {
    await usersAPI.delete(toDelete.id);

    toast.success("User berhasil dihapus");
    setToDelete(null);
    await load();

    setBanner({ type: "success", text: "Akun berhasil dihapus!" });
    setTimeout(() => setBanner(null), 3000);

  } catch (error: any) {
    const msg = error?.response?.data?.message;

    if (msg === "Tidak dapat menghapus akun sendiri") {
      setToDelete(null); // tutup modal

      // tampilkan banner merah
      setErrorBanner("Anda tidak dapat menghapus akun sendiri");
      setTimeout(() => setErrorBanner(null), 4000);

      return;
    }

    toast.error(msg || "Gagal menghapus user");
  }
}

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-9">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative isolate shrink-0">
              <span
                aria-hidden
                className="absolute -inset-1.5 sm:-inset-2 rounded-2xl bg-gradient-to-br from-emerald-400/25 to-teal-500/25 blur-lg -z-10"
              />
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-[22px] leading-[1.15] sm:text-3xl md:text-4xl font-bold text-gray-800">
                Manajemen Akun dan Peran<br className="hidden sm:block" />
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-0.5">Kelola Akun Pengguna</p>
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

        {/* Banner sukses */}
        {banner && (
          <div className="rounded-2xl px-5 py-4 flex items-start gap-3 shadow-lg border-2 bg-emerald-50 border-emerald-200 text-emerald-900 mb-4">
            <svg
              className="h-6 w-6 flex-shrink-0 mt-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14l-4-4 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 7z" />
            </svg>
            <span className="font-semibold">{banner.text}</span>
          </div>
        )}

        {errorBanner && (
          <div className="rounded-2xl px-5 py-4 flex items-start gap-3 shadow-lg border-2 bg-red-50 border-red-200 text-red-900 mb-4">
            <svg
              className="h-6 w-6 flex-shrink-0 mt-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z" />
            </svg>
            <span className="font-semibold">{errorBanner}</span>
          </div>
        )}

        {/* Card + Search + Table */}
        <section>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="w-1.5 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"
                    />
                    <h2 className="text-xl font-bold">Daftar Akun</h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-4">
                    Kelola Akun Pengguna GLEAM
                  </p>
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
                  placeholder="Cari nama, username, atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="px-6">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-emerald-50 to-teal-50">
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-4 font-bold text-gray-700">Nama</th>
                      <th className="text-left p-4 font-bold text-gray-700">Username</th>
                      <th className="text-left p-4 font-bold text-gray-700">Email</th>
                      <th className="text-left p-4 font-bold text-gray-700">No. HP</th>
                      <th className="text-left p-4 font-bold text-gray-700">Role</th>
                      <th className="text-center p-4 font-bold text-gray-700">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center p-8">
                          <div className="inline-block w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        </td>
                      </tr>
                    ) : currentRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center p-8">
                          {searchQuery ? (
                            <div className="py-8">
                              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 mb-4">
                                <Search className="h-8 w-8 text-amber-600" />
                              </div>
                              <p className="text-gray-700 font-bold">
                                Tidak ada hasil pencarian
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Coba kata kunci lain
                              </p>
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
                          <td className="p-4 font-medium text-gray-900">{r.nama}</td>
                          <td className="p-4 text-gray-700">{r.username}</td>
                          <td className="p-4 text-gray-600 text-sm">{r.email}</td>
                          <td className="p-4 text-gray-600">
                            {r.nomor_telepon || "-"}
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
                              {/* ✏️ Tombol Edit */}
                              <button
                                onClick={() => {
                                  if (r.role === "user") {
                                    toast.warning(
                                      "Akun pasien tidak dapat diedit oleh admin"
                                    );
                                    return;
                                  }
                                  setEditUser(r);
                                }}
                                disabled={r.role === "user"}
                                className={`p-2.5 rounded-xl transition-all shadow-sm ${
                                  r.role === "user"
                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                    : "text-amber-600 bg-amber-50 hover:bg-gradient-to-br hover:from-amber-500 hover:to-orange-500 hover:text-white hover:scale-110"
                                }`}
                                title={
                                  r.role === "user"
                                    ? "Tidak dapat mengedit akun pasien"
                                    : "Edit"
                                }
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              {/* 🗑️ Tombol Hapus */}
                              <button
                                onClick={() => {
                                  const currentEmail =
                                    localStorage.getItem("gleam_email");
                                  if (r.email === currentEmail) {
                                    toast.warning(
                                      "Anda tidak dapat menghapus akun sendiri"
                                    );
                                    return;
                                  }
                                  setToDelete(r);
                                }}
                                className={`p-2.5 rounded-xl transition-all shadow-sm ${
                                  localStorage.getItem("gleam_email") === r.email
                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                    : "text-red-600 bg-red-50 hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-500 hover:text-white hover:scale-110"
                                }`}
                                title={
                                  localStorage.getItem("gleam_email") === r.email
                                    ? "Tidak dapat menghapus akun sendiri"
                                    : "Hapus"
                                }
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
              <div className="px-3 sm:px-6 pb-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-100 rounded-2xl p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
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
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                      className="border-gray-300 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 rounded-xl text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 transition-colors"
                    >
                      Sebelumnya
                    </Button>
                    {Array.from(
                      { length: Math.min(5, totalPages) },
                      (_, i) => {
                        let page: number;
                        if (totalPages <= 5) page = i + 1;
                        else if (currentPage <= 3) page = i + 1;
                        else if (currentPage >= totalPages - 2)
                          page = totalPages - 4 + i;
                        else page = currentPage - 2 + i;
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={
                              currentPage === page
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-md text-xs sm:text-sm min-w-[2rem] sm:min-w-[2.5rem] h-8 sm:h-9 px-2 sm:px-3 transition-colors"
                                : "border-gray-300 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl text-xs sm:text-sm min-w-[2rem] sm:min-w-[2.5rem] h-8 sm:h-9 px-2 sm:px-3 transition-colors"
                            }
                          >
                            {page}
                          </Button>
                        );
                      }
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="border-gray-300 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 rounded-xl text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 transition-colors"
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
            setBanner({ type: "success", text: "Akun berhasil ditambahkan!" });
            setTimeout(() => setBanner(null), 3000);
          }}
          onClose={() => {
            setShowAdd(false);
            setTimeout(blurSearch, 0);
          }}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onUpdated={async () => {
            await load();
            setBanner({ type: "success", text: "Akun berhasil diperbarui!" });
            setTimeout(() => setBanner(null), 3000);
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
              <AlertDialogTitle className="text-lg font-bold">
                Hapus Akun?
              </AlertDialogTitle>
            </div>
          </AlertDialogHeader>

          <div className="px-6 py-4 border-b border-gray-100">
            <AlertDialogDescription className="text-gray-600">
              Apakah Anda yakin ingin menghapus akun{" "}
              <b className="text-gray-900">"{toDelete?.nama}"</b>? Tindakan ini
              tidak dapat dibatalkan.
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
