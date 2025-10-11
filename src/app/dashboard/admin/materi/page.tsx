"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  FileText,
  Video,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  Clock,
  Upload,
} from "lucide-react";
import axios from "axios";
import { api } from "@/lib/api";

/* ================= Helper (SATU VERSI SAJA) ================= */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/+$/, "");
const FILE_HOST = API_BASE.replace(/\/api\/?$/, "");

function toAbsolute(url?: string | null) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `${FILE_HOST}${url}`;
}

const LS_TOKEN_KEY = "gleam_token";
const getToken = () =>
  (typeof window !== "undefined" ? localStorage.getItem(LS_TOKEN_KEY) : "") || "";

function getFilenameFromCD(cd?: string) {
  if (!cd) return null;
  const m = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(cd);
  try {
    return m ? decodeURIComponent(m[1].replace(/\"/g, "")) : null;
  } catch {
    return m?.[1] ?? null;
  }
}

async function downloadPdfWithAuth(konten: { file_url?: string | null; judul: string }) {
  const raw = konten.file_url ?? "";
  const url = toAbsolute(raw);
  if (!url) throw new Error("URL file kosong");

  try {
    const token = getToken();
    const res = await axios.get(url, {
      responseType: "blob",
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const blob = new Blob([res.data], {
      type: res.headers["content-type"] || "application/pdf",
    });
    const href = URL.createObjectURL(blob);

    const cd = res.headers["content-disposition"];
    const fromHeader = getFilenameFromCD(cd);
    const fallback = (konten.judul || "materi").replace(/[^\w\-]+/g, "_") + ".pdf";
    const filename = fromHeader || fallback;

    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/* ================= Types ================= */
type Konten = {
  id: string;
  judul: string;
  video_id: string | null;
  file_url: string | null;
  deskripsi: string;
  created_at: string;
  updated_at: string;
};

/* ============== Page ============== */
export default function MateriPage() {
  const [kontenList, setKontenList] = useState<Konten[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ⬇️ Modal konfirmasi hapus (dipindah ke komponen)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);

  const [formData, setFormData] = useState({
    judul: "",
    video_id: "",
    tanpa_video: false,
    file_pdf: null as File | null,
    deskripsi: "",
  });

  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchKonten();
  }, []);

  async function fetchKonten() {
    setLoading(true);
    try {
      const res = await api.get("/admin/materi/konten");
      setKontenList(res.data?.data || []);
    } catch (error) {
      console.error("Gagal memuat konten:", error);
      setKontenList([]);
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditMode(false);
    setEditId(null);
    setFormData({
      judul: "",
      video_id: "",
      tanpa_video: false,
      file_pdf: null,
      deskripsi: "",
    });
    setShowModal(true);
  }

  function openEditModal(konten: Konten) {
    setEditMode(true);
    setEditId(konten.id);
    setFormData({
      judul: konten.judul,
      video_id: konten.video_id || "",
      tanpa_video: !konten.video_id,
      file_pdf: null,
      deskripsi: konten.deskripsi,
    });
    setShowModal(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("judul", formData.judul);
      fd.append("deskripsi", formData.deskripsi);
      if (!formData.tanpa_video && formData.video_id.trim()) {
        fd.append("video_id", formData.video_id.trim());
      } else {
        fd.append("video_id", "");
      }
      if (formData.file_pdf) fd.append("file_pdf", formData.file_pdf);

      if (editMode && editId) {
        fd.append("_method", "PATCH");
        await api.post(`/admin/materi/konten/${editId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setMsg({ type: "success", text: "Konten berhasil diperbarui!" });
      } else {
        if (!formData.file_pdf) {
          setMsg({ type: "error", text: "File PDF wajib diunggah." });
          setSubmitting(false);
          return;
        }
        await api.post("/admin/materi/konten", fd, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setMsg({ type: "success", text: "Konten berhasil ditambahkan!" });
      }

      setShowModal(false);
      fetchKonten();
      setTimeout(() => setMsg(null), 3000);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.file_pdf?.[0] ||
        "Gagal menyimpan konten.";
      setMsg({ type: "error", text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  }

  // Hapus tanpa confirm browser; confirm pakai modal
  async function handleDelete(kontenId: string) {
    try {
      await api.delete(`/admin/materi/konten/${kontenId}`, { withCredentials: true });
      setMsg({ type: "success", text: "Konten berhasil dihapus!" });
      fetchKonten();
      setTimeout(() => setMsg(null), 3000);
    } catch (error) {
      setMsg({ type: "error", text: "Gagal menghapus konten." });
    }
  }

  const greenGrad = "from-emerald-500 to-teal-500";

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Materi Edukasi</h1>
                <p className="text-gray-600 mt-0.5">Kelola konten materi Diabetes Melitus</p>
              </div>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold"
          >
            <Plus className="h-5 w-5" />
            Tambah Konten
          </button>
        </header>

        {/* Notification */}
        {msg && (
          <div
            className={`rounded-2xl px-5 py-4 flex items-start gap-3 shadow-lg border-2 ${
              msg.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
            )}
            <span className="font-semibold">{msg.text}</span>
          </div>
        )}

        {/* Content List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                  Daftar Konten
                </h2>
                <p className="text-sm text-gray-600 mt-1 ml-4">
                  {loading ? "Memuat…" : `${kontenList.length} konten tersedia`}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{kontenList.length} Materi</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block relative">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4 font-medium">Memuat konten…</p>
              </div>
            ) : kontenList.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-inner">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-700 font-bold text-lg mb-2">Belum ada konten</p>
                <p className="text-sm text-gray-500">Klik "Tambah Konten" untuk memulai</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {kontenList.map((konten, index) => (
                  <div
                    key={konten.id}
                    className="group relative bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* overlay hijau */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${greenGrad} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${greenGrad} opacity-5 rounded-bl-full`} />

                    <div className="relative flex items-start gap-5">
                      {/* badge nomor hijau */}
                      <div className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${greenGrad} text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0 space-y-4">
                        <h3 className="font-bold text-gray-900 text-2xl group-hover:text-emerald-700 transition-colors">
                          {konten.judul}
                        </h3>

                        <p className="text-gray-600 text-base leading-relaxed break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
                          {konten.deskripsi}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          {konten.file_url && (
                            <a
                              href={toAbsolute(konten.file_url)}
                              onClick={async (e) => {
                                e.preventDefault();
                                await downloadPdfWithAuth({ file_url: konten.file_url, judul: konten.judul });
                              }}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-700 hover:to-yellow-700 transition-all shadow-md hover:shadow-xl hover:scale-105 font-semibold text-sm"
                            >
                              <Download className="h-4 w-4" />
                              Unduh PDF
                            </a>
                          )}

                          {konten.video_id && (
                            <a
                              href={`https://www.youtube.com/watch?v=${konten.video_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-700 hover:to-blue-700 transition-all shadow-md hover:shadow-xl hover:scale-105 font-semibold text-sm"
                            >
                              <Video className="h-4 w-4" />
                              Tonton Video
                            </a>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                          {konten.created_at && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="font-medium">
                                Dibuat:{" "}
                                {new Date(konten.created_at).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                          {konten.updated_at && (
                            <>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="font-medium">
                                  Diperbarui:{" "}
                                  {new Date(konten.updated_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => openEditModal(konten)}
                          className="p-3 rounded-xl text-amber-600 bg-amber-50 hover:bg-gradient-to-br hover:from-amber-500 hover:to-orange-500 hover:text-white transition-all shadow-sm hover:shadow-lg hover:scale-110"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ id: konten.id, title: konten.judul })}
                          className="p-3 rounded-xl text-red-600 bg-red-50 hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-500 hover:text-white transition-all shadow-sm hover:shadow-lg hover:scale-110"
                          title="Hapus"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center py-6">
          <p className="text-sm text-gray-500">
            💡 Tip: Unduh materi PDF untuk belajar offline dan tonton video untuk pemahaman yang
            lebih interaktif
          </p>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {editMode ? <Pencil className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                  {editMode ? "Edit Konten" : "Tambah Konten"}
                </h2>
                <p className="text-emerald-100 text-sm mt-1">
                  {editMode ? "Perbarui informasi konten" : "Lengkapi formulir di bawah"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  Judul Konten <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Pengenalan Diabetes Melitus"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  Video ID YouTube {!formData.tanpa_video && <span className="text-red-500">*</span>}
                </label>
                <input
                  disabled={formData.tanpa_video}
                  value={formData.video_id}
                  onChange={(e) => setFormData({ ...formData, video_id: e.target.value })}
                  placeholder="Contoh: y55Wupx2ZDU"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-xs text-blue-900">
                    <strong>Contoh:</strong> https://youtube.com/watch?v=
                    <span className="font-mono bg-white px-2 py-0.5 rounded">y55Wupx2ZDU</span>
                    <br />
                    Masukkan hanya: <span className="font-mono bg-white px-2 py-0.5 rounded">y55Wupx2ZDU</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border-2 border-gray-200">
                <input
                  type="checkbox"
                  id="tanpa_video"
                  checked={formData.tanpa_video}
                  onChange={(e) =>
                    setFormData({ ...formData, tanpa_video: e.target.checked, video_id: "" })
                  }
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                />
                <label htmlFor="tanpa_video" className="text-sm text-gray-700 cursor-pointer flex-1">
                  <strong>Konten tanpa video YouTube</strong>
                  <br />
                  <span className="text-gray-500 text-xs">Video ID akan diabaikan jika dicentang</span>
                </label>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  File PDF {!editMode && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setFormData({ ...formData, file_pdf: e.target.files?.[0] || null })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-blue-600 file:text-white file:text-sm file:font-semibold hover:file:from-blue-600 hover:file:to-blue-700 file:cursor-pointer"
                />
                {editMode && (
                  <p className="text-xs text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Kosongkan jika tidak ingin mengubah file PDF yang sudah ada</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Tulis deskripsi singkat tentang konten..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold disabled:opacity-50 transition-all hover:scale-105"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl py-3 font-semibold disabled:opacity-50 transition-all hover:scale-105 shadow-lg"
                >
                  {submitting ? "Menyimpan..." : editMode ? "Simpan" : "Tambah"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border-2 border-gray-100 shadow-2xl">
            <div className="px-5 py-4 border-b-2 border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 grid place-items-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Hapus Materi?</h3>
            </div>

            <div className="px-5 py-4 space-y-1.5">
              <p className="text-sm text-gray-700">
                Apakah Anda yakin ingin benar-benar menghapus{" "}
                <span className="font-semibold">{confirmDelete.title}</span>?
              </p>
              <p className="text-xs text-gray-500">Tindakan ini tidak dapat dibatalkan.</p>
            </div>

            <div className="px-5 py-4 flex items-center justify-end gap-3 border-t-2 border-gray-100">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl border-2 border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold transition-all"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  await handleDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-rose-700 hover:shadow-lg transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
