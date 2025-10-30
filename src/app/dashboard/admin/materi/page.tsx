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
} from "lucide-react";
import axios from "axios";
import { api } from "@/lib/api";

/* ================= Konstanta ================= */
const MAX_TITLE = 255;

/* ================= Helper (SATU VERSI SAJA) ================= */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/+$/, "");
const FILE_HOST = API_BASE.replace(/\/api\/?$/, "");

// ⬇️ Materi yang dikelola halaman ini
const MATERI_SLUG = "diabetes-melitus";

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

function isCrossOrigin(url: string) {
  try {
    const u = new URL(url, window.location.href);
    return u.origin !== window.location.origin;
  } catch {
    return true;
  }
}

async function downloadPdfWithAuth(konten: { id?: string | number; file_url?: string | null; judul: string }) {
  const raw = konten.file_url ?? "";
  const url = toAbsolute(raw);
  if (!url) throw new Error("URL file kosong");

  const openNewTab = () => window.open(url, "_blank", "noopener,noreferrer");

  // 1) kalau cross-origin → buka tab (biar gak kena CORS XHR)
  if (typeof window !== "undefined" && isCrossOrigin(url)) {
    openNewTab();
    return;
  }

  try {
    const token = getToken();
    const res = await axios.get(url, {
      responseType: "blob",
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      validateStatus: () => true, // biar bisa cek 403/404 sendiri
    });

    if (res.status === 200) {
      const blob = new Blob([res.data], { type: res.headers["content-type"] || "application/pdf" });
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
      return;
    }

    // 2) fallback: kalau static 403/404 dan kita punya id → tembak endpoint download
    if ((res.status === 403 || res.status === 404) && konten.id != null) {
      const dl = await api.get(`/admin/materi/konten/${konten.id}/download`, {
        responseType: "blob",
        withCredentials: true,
      });
      const href = URL.createObjectURL(dl.data);
      const a = document.createElement("a");
      a.href = href;
      a.download = (konten.judul || "materi").replace(/[^\w\-]+/g, "_") + ".pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
      return;
    }

    // 3) terakhir: buka tab biasa
    openNewTab();
  } catch {
    openNewTab();
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

type FieldErrors = {
  judul?: string;
  deskripsi?: string;
  file_pdf?: string;
};

/* ============== Page ============== */
export default function MateriPage() {
  const [kontenList, setKontenList] = useState<Konten[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal konfirmasi hapus
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);

  const [formData, setFormData] = useState({
    judul: "",
    video_id: "",
    tanpa_video: false,
    file_pdf: null as File | null,
    deskripsi: "",
  });

  // Banner global di halaman (sukses/gagal setelah submit)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  // Error di dalam modal (per-field + banner di atas form)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [topError, setTopError] = useState<string | null>(null);

  useEffect(() => {
    fetchKonten();
  }, []);

  async function fetchKonten() {
    setLoading(true);
    try {
      const res = await api.get("/admin/materi/konten", { params: { slug: MATERI_SLUG } });
      const list: Konten[] = Array.isArray(res.data?.data) ? res.data.data : [];
      // sort ASC by created_at (terlama duluan)
      const sorted = list.slice().sort((a, b) => {
        const ta = new Date(a.created_at ?? a.updated_at ?? 0).getTime();
        const tb = new Date(b.created_at ?? b.updated_at ?? 0).getTime();
        return ta - tb;
      });
      setKontenList(sorted);
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
    setFieldErrors({});
    setTopError(null);
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
    setFieldErrors({});
    setTopError(null);
    setShowModal(true);
  }

  function validateForm(): boolean {
    const errs: FieldErrors = {};
    const j = formData.judul?.trim() ?? "";
    const d = formData.deskripsi?.trim() ?? "";

    if (!j) errs.judul = "Judul wajib diisi.";
    else if (j.length > MAX_TITLE) errs.judul = `Judul maksimal ${MAX_TITLE} karakter.`;

    if (!d) errs.deskripsi = "Deskripsi wajib diisi.";

    setFieldErrors(errs);
    setTopError(Object.values(errs)[0] ?? null);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setTopError(null);

    // Validasi client-side
    if (!validateForm()) {
      setSubmitting(false);
      return; // modal tetap terbuka
    }

    try {
      const fd = new FormData();
      fd.append("slug", MATERI_SLUG);
      fd.append("judul", formData.judul.trim());
      fd.append("deskripsi", formData.deskripsi.trim());
      if (formData.video_id.trim()) fd.append("video_id", formData.video_id.trim());
      if (formData.file_pdf) fd.append("file_pdf", formData.file_pdf);

      if (editMode && editId) {
        fd.append("_method", "PATCH");
        await api.post(`/admin/materi/konten/${editId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setMsg({ type: "success", text: "Konten berhasil diperbarui!" });
      } else {
        await api.post("/admin/materi/konten", fd, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setMsg({ type: "success", text: "Konten berhasil ditambahkan!" });
      }

      // reset error form & tutup modal saat sukses
      setFieldErrors({});
      setTopError(null);
      setShowModal(false);
      fetchKonten();
      setTimeout(() => setMsg(null), 3000);
    } catch (error: any) {
      // Tangkap 422 & map field
      const status = error?.response?.status;
      const errs = (error?.response?.data?.errors ?? {}) as Record<string, string[]>;
      const mapped: FieldErrors = {};
      if (errs.judul?.[0]) mapped.judul = errs.judul[0];
      if (errs.deskripsi?.[0]) mapped.deskripsi = errs.deskripsi[0];
      if (errs.file_pdf?.[0]) mapped.file_pdf = errs.file_pdf[0];

      if (status === 422 && Object.keys(mapped).length) {
        setFieldErrors(mapped);
        setTopError(Object.values(mapped)[0]);
      } else {
        const fallback =
          error?.response?.data?.message ||
          error?.message ||
          "Gagal menyimpan konten.";
        setTopError(fallback);
      }
    } finally {
      setSubmitting(false);
    }
  }

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
    <div className="min-h-screen bg-white px-6 md:px-10 py-9 overflow-x-hidden">
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
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            {/* Judul + subjudul */}
            <div>
              <h1 className="text-[22px] leading-[1.15] sm:text-3xl md:text-4xl font-bold text-gray-800">
                Materi Edukasi<br className="hidden sm:block" />
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-0.5">
                Kelola konten materi Diabetes Melitus
              </p>
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
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-3xl">
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
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-5 rounded-bl-full" />

                    <div className="relative flex flex-col md:flex-row items-start gap-5">
                      <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0 w-full space-y-4">
                        <h3
                          className="font-bold text-gray-900
                                    text-lg sm:text-xl md:text-2xl
                                    leading-tight
                                    break-all sm:break-words [overflow-wrap:anywhere]
                                    group-hover:text-emerald-700 transition-colors"
                        >
                          {konten.judul}
                        </h3>

                        <p
                          className="text-gray-600 text-sm sm:text-base leading-relaxed
                                    max-w-full whitespace-pre-wrap
                                    break-all sm:break-words [overflow-wrap:anywhere]"
                        >
                          {konten.deskripsi}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          {konten.file_url && (
                            <a
                              href={toAbsolute(konten.file_url)}
                              onClick={async (e) => {
                                e.preventDefault();
                                await downloadPdfWithAuth({ id: konten.id, file_url: konten.file_url, judul: konten.judul });
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

                      <div className="flex md:flex-col flex-row items-center gap-2 flex-shrink-0 w-full md:w-auto">
                        <button
                          onClick={() => openEditModal(konten)}
                          className="flex-1 md:flex-none p-3 rounded-xl text-amber-600 bg-amber-50 hover:bg-gradient-to-br hover:from-amber-500 hover:to-orange-500 hover:text-white transition-all shadow-sm hover:shadow-lg hover:scale-110"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ id: konten.id, title: konten.judul })}
                          className="flex-1 md:flex-none p-3 rounded-xl text-red-600 bg-red-50 hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-500 hover:text-white transition-all shadow-sm hover:shadow-lg hover:scale-110"
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
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h[90vh] max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-6 py-5 flex items-center justify-between rounded-t-3xl">
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

            {/* Banner error di dalam modal */}
            {topError && (
              <div className="mx-6 mt-4 mb-0 rounded-xl border-2 border-rose-200 bg-rose-50 text-rose-900 px-4 py-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm font-medium">{topError}</div>
                <button
                  onClick={() => setTopError(null)}
                  className="ml-auto text-rose-700 hover:text-rose-900"
                  title="Tutup"
                >
                  ×
                </button>
              </div>
            )}

            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-100px)]">
              {/* JUDUL */}
              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  Judul Konten <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.judul}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({ ...formData, judul: v });
                    // realtime hint
                    if (!v.trim()) setFieldErrors((s) => ({ ...s, judul: "Judul wajib diisi." }));
                    else if (v.length > MAX_TITLE) setFieldErrors((s) => ({ ...s, judul: `Judul maksimal ${MAX_TITLE} karakter.` }));
                    else setFieldErrors((s) => ({ ...s, judul: undefined }));
                  }}
                  maxLength={MAX_TITLE + 20} // biar user lihat peringatan kalau kelewat
                  placeholder="Contoh: Pengenalan Diabetes Melitus"
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                    fieldErrors.judul
                      ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  }`}
                />
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className={formData.judul.length > MAX_TITLE ? "text-rose-600 font-semibold" : "text-gray-500"}>
                    {Math.min(formData.judul.length, MAX_TITLE + 20)}/{MAX_TITLE}
                  </span>
                  {fieldErrors.judul && <span className="text-rose-600 font-medium">{fieldErrors.judul}</span>}
                </div>
              </div>

              {/* VIDEO ID */}
              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  Video ID YouTube <span className="text-gray-400 font-normal">(opsional)</span>
                </label>
                <input
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

              {/* FILE PDF */}
              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  File PDF <span className="text-gray-400 font-normal">(opsional)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    setFormData({ ...formData, file_pdf: e.target.files?.[0] || null });
                    if (fieldErrors.file_pdf) setFieldErrors((s) => ({ ...s, file_pdf: undefined }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-blue-600 file:text-white file:text-sm file:font-semibold hover:file:from-blue-600 hover:file:to-blue-700 file:cursor-pointer ${
                    fieldErrors.file_pdf
                      ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                />
                {fieldErrors.file_pdf && (
                  <p className="text-xs text-rose-600 mt-1">{fieldErrors.file_pdf}</p>
                )}

                {editMode && (
                  <p className="text-xs text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Kosongkan jika tidak ingin mengubah file PDF yang sudah ada</span>
                  </p>
                )}
              </div>

              {/* DESKRIPSI */}
              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({ ...formData, deskripsi: v });
                    if (!v.trim()) setFieldErrors((s) => ({ ...s, deskripsi: "Deskripsi wajib diisi." }));
                    else setFieldErrors((s) => ({ ...s, deskripsi: undefined }));
                  }}
                  placeholder="Tulis deskripsi singkat tentang konten..."
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${
                    fieldErrors.deskripsi
                      ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  }`}
                />
                {fieldErrors.deskripsi && (
                  <p className="text-xs text-rose-600">{fieldErrors.deskripsi}</p>
                )}
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
                  disabled={
                    submitting ||
                    !formData.judul.trim() ||
                    formData.judul.trim().length > MAX_TITLE ||
                    !formData.deskripsi.trim()
                  }
                  className={`flex-1 rounded-xl py-3 font-semibold transition-all hover:scale-105 shadow-lg text-white ${
                    submitting ||
                    !formData.judul.trim() ||
                    formData.judul.trim().length > MAX_TITLE ||
                    !formData.deskripsi.trim()
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  }`}
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
          <div className="w-full max-w-[92vw] sm:max-w-sm rounded-2xl bg-white border-2 border-gray-100 shadow-2xl">
            <div className="px-5 py-4 border-b-2 border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 grid place-items-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Hapus Materi?</h3>
            </div>

            <div className="px-5 py-4 space-y-1.5">
              <p className="text-sm text-gray-700">
                Apakah Anda yakin ingin benar-benar menghapus{" "}
                <span className="font-semibold break-all [overflow-wrap:anywhere]">
                  {confirmDelete.title}
                </span>
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
