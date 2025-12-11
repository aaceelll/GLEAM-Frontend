"use client";

import { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash2, FileText, Video, CheckCircle2, AlertCircle, Download, Calendar, Clock } from "lucide-react";
import axios from "axios";
import { api } from "@/lib/api";

const MAX_TITLE = 255; // max jumlah karakter judul
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/+$/, "");
const FILE_HOST = API_BASE.replace(/\/api\/?$/, ""); //host untuk file untuk bentuk URL absolut
const MATERI_SLUG = "diabetes-melitus";

// Helper Token
const getToken = () =>
  (typeof window !== "undefined" && localStorage.getItem("gleam_token")) || "";

// Helper URL File
const toAbsolute = (url?: string | null) =>
  !url ? "" : /^https?:\/\//i.test(url) ? url : `${FILE_HOST}${url}`; // kalo masih relatif, jadiin absolut

// --------- Download PDF ----------- //
async function downloadPDF(k: { id?: string; file_url?: string | null; judul: string }) {
  const url = toAbsolute(k.file_url);
  const openNew = () => window.open(url, "_blank");

  if (!url) return;

  try { // Coba download langsung via axios
    const res = await axios.get(url, {
      responseType: "blob",
      withCredentials: true,
      headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
    });

    if (res.status === 200) {
      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/pdf",
      });
      const fallback =
        (k.judul || "materi").replace(/[^\w\-]+/g, "_") + ".pdf";

      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = fallback;
      a.click();
      URL.revokeObjectURL(href);
      return;
    }
    openNew();
  } catch {
    openNew();
  }
}

type Konten = {
  id: string;
  judul: string;
  video_id: string | null;
  file_url: string | null;
  deskripsi: string;
  created_at: string;
  updated_at: string;
};

type Err = { judul?: string; deskripsi?: string; file_pdf?: string };

export default function MateriPage() {
  const [kontenList, setList] = useState<Konten[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [submit, setSubmit] = useState(false);
  const [confirm, setConfirm] = useState<{ id: string; title: string } | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<Err>({});
  const [topErr, setTopErr] = useState<string | null>(null);

  const [form, setForm] = useState({
    judul: "",
    video_id: "",
    file_pdf: null as File | null,
    deskripsi: "",
  });

  /* Fetch konten */
  const fetchKonten = async () => {
    try {
      const r = await api.get("/admin/materi/konten", { params: { slug: MATERI_SLUG } });
      const list = Array.isArray(r.data?.data) ? r.data.data : [];
      setList(
        (list as Konten[]).sort((a, b) =>
          new Date(b.created_at ?? b.updated_at ?? 0).getTime() -
          new Date(a.created_at ?? a.updated_at ?? 0).getTime()
        )
      );
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKonten();
  }, []);

  /* Modal Helpers */
  const openAdd = () => {
    setEditId(null);
    setForm({ judul: "", video_id: "", file_pdf: null, deskripsi: "" });
    setErrors({});
    setTopErr(null);
    setShow(true);
  };

  const openEdit = (k: Konten) => {
    setEditId(k.id);
    setForm({
      judul: k.judul,
      video_id: k.video_id || "",
      file_pdf: null,
      deskripsi: k.deskripsi,
    });
    setErrors({});
    setTopErr(null);
    setShow(true);
  };

  /* Validasi */
  const validate = () => {
    const e: Err = {};
    const j = form.judul.trim();
    const d = form.deskripsi.trim();

    if (!j) e.judul = "Judul wajib diisi.";
    else if (j.length > MAX_TITLE) e.judul = `Judul maksimal ${MAX_TITLE} karakter.`;

    if (!d) e.deskripsi = "Deskripsi wajib diisi.";

    setErrors(e);
    setTopErr(Object.values(e)[0] || null);

    return Object.keys(e).length === 0;
  };

  /* Submit */
  const handleSubmit = async () => {
    setSubmit(true);
    if (!validate()) return setSubmit(false);

    try {
      const fd = new FormData();
      fd.append("slug", MATERI_SLUG);
      fd.append("judul", form.judul.trim());
      fd.append("deskripsi", form.deskripsi.trim());
      if (form.video_id.trim()) fd.append("video_id", form.video_id.trim());
      if (form.file_pdf) fd.append("file_pdf", form.file_pdf);

      if (editId) {
        fd.append("_method", "PATCH");
        await api.post(`/admin/materi/konten/${editId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg({ type: "success", text: "Konten diperbarui!" });
      } else {
        await api.post("/admin/materi/konten", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg({ type: "success", text: "Konten ditambahkan!" });
      }

      setShow(false);
      fetchKonten();
      setTimeout(() => setMsg(null), 3000);
    } catch (e: any) {
      const errs = e?.response?.data?.errors || {};
      const map: Err = {
        judul: errs.judul?.[0],
        deskripsi: errs.deskripsi?.[0],
        file_pdf: errs.file_pdf?.[0],
      };
      if (e.response?.status === 422 && Object.values(map).some(Boolean)) {
        setErrors(map);
        setTopErr(Object.values(map)[0]);
      } else setTopErr(e?.response?.data?.message || "Gagal menyimpan.");
    } finally {
      setSubmit(false);
    }
  };

  /* Delete */
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/materi/konten/${id}`);
      setMsg({ type: "success", text: "Konten dihapus!" });
      fetchKonten();
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg({ type: "error", text: "Gagal menghapus konten." });
    }
  };

/* ------ Tampilan UI -------- */
  const editMode = !!editId;
  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-9 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header + Judul */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative isolate shrink-0">
              <span
                aria-hidden
                className="absolute -inset-1.5 sm:-inset-2 rounded-2xl bg-gradient-to-br from-emerald-400/25 to-teal-500/25 blur-lg -z-10"/>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
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
          onClick={openAdd}
          className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold">
          <Plus className="h-5 w-5" />
          Tambah Konten
        </button>

        {/* Success Notification */}
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

        {/* Daftar Konten */}
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

          {/* Tampilan Urutan Daftar Konten */}
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
                    className="group relative bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-5 rounded-bl-full" />
                    <div className="relative flex flex-col md:flex-row items-start gap-5">
                      <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0 w-full space-y-4">
                        <h3 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl leading-tight break-all sm:break-words [overflow-wrap:anywhere] group-hover:text-emerald-700 transition-colors">
                          {konten.judul}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-full whitespace-pre-wrap break-all sm:break-words [overflow-wrap:anywhere]">
                          {konten.deskripsi}
                        </p>
                      <div className="flex flex-wrap items-center gap-3">
                          {konten.file_url && (
                            <a href={toAbsolute(konten.file_url)}
                               onClick={async (e) => {
                               e.preventDefault();
                                 await downloadPDF({ id: konten.id, file_url: konten.file_url, judul: konten.judul });
                               }}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-700 hover:to-yellow-700 transition-all shadow-md hover:shadow-xl hover:scale-105 font-semibold text-sm">
                                <Download className="h-4 w-4" /> Unduh PDF </a>
                          )}
                          {konten.video_id && (
                            <a href={`https://www.youtube.com/watch?v=${konten.video_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-700 hover:to-blue-700 transition-all shadow-md hover:shadow-xl hover:scale-105 font-semibold text-sm">
                              <Video className="h-4 w-4" /> Tonton Video </a>
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
                                    day: "numeric", month: "short", year: "numeric",
                                  })}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>    
                      {/* Tombol Edit + Hapus Konten */}
                      <div className="flex md:flex-col flex-row items-center gap-2 flex-shrink-0 w-full md:w-auto">
                        <button
                          onClick={() => openEdit(konten)}
                          className="flex-1 md:flex-none p-3 rounded-xl text-amber-600 bg-amber-50 hover:bg-gradient-to-br hover:from-amber-500 hover:to-orange-500 hover:text-white transition-all shadow-sm hover:shadow-lg hover:scale-110"
                          title="Edit">
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setConfirm({ id: konten.id, title: konten.judul })}
                          className="flex-1 md:flex-none p-3 rounded-xl text-red-600 bg-red-50 hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-500 hover:text-white transition-all shadow-sm hover:shadow-lg hover:scale-110"
                          title="Hapus">
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
      </div>

      {/* Tambah Konten Form */}
      {show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
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
                onClick={() => setShow(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300">
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Banner error server */}
            {topErr && (
              <div className="mx-6 mt-4 mb-0 rounded-xl border-2 border-rose-200 bg-rose-50 text-rose-900 px-4 py-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm font-medium">{topErr}</div>
                <button
                  onClick={() => setTopErr(null)}
                  className="ml-auto text-rose-700 hover:text-rose-900"
                  title="Tutup">
                  ×
                </button>
              </div>
            )}

            {/* Isi Form */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-100px)]">
              {/* Judul */}
              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  Judul Konten <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.judul}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((s) => ({ ...s, judul: v }));
                    if (!v.trim()) setErrors((s) => ({ ...s, judul: "Judul wajib diisi." }));
                    else if (v.length > MAX_TITLE)
                      setErrors((s) => ({ ...s, judul: `Judul maksimal ${MAX_TITLE} karakter.` }));
                    else setErrors((s) => ({ ...s, judul: undefined }));
                  }}
                  maxLength={MAX_TITLE + 20}
                  placeholder="Contoh: Pengenalan Diabetes Melitus"
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                    errors.judul
                      ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  }`}
                />
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className={form.judul.length > MAX_TITLE ? "text-rose-600 font-semibold" : "text-gray-500"}>
                    {Math.min(form.judul.length, MAX_TITLE + 20)}/{MAX_TITLE}
                  </span>
                  {errors.judul && <span className="text-rose-600 font-medium">{errors.judul}</span>}
                </div>
              </div>

              {/* Video ID */}
              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  Video ID YouTube <span className="text-gray-400 font-normal">(opsional)</span>
                </label>
                <input
                  value={form.video_id}
                  onChange={(e) => setForm((s) => ({ ...s, video_id: e.target.value }))}
                  placeholder="Contoh: y55Wupx2ZDU"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"/>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-xs text-blue-900">
                    <strong>Contoh:</strong> https://youtube.com/watch?v=
                    <span className="font-mono bg-white px-2 py-0.5 rounded">y55Wupx2ZDU</span>
                    <br />
                    Masukkan hanya: <span className="font-mono bg-white px-2 py-0.5 rounded">y55Wupx2ZDU</span>
                  </p>
                </div>
              </div>

              {/* File PDF */}
              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  File PDF <span className="text-gray-400 font-normal">(opsional)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    setForm((s) => ({ ...s, file_pdf: e.target.files?.[0] || null }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-blue-600 file:text-white file:text-sm file:font-semibold hover:file:from-blue-600 hover:file:to-blue-700 file:cursor-pointer ${
                    errors.file_pdf
                      ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                />
                {errors.file_pdf && <p className="text-xs text-rose-600 mt-1">{errors.file_pdf}</p>}
                {/* Edit Mode PDF */}
                {editMode && (
                  (() => {
                    const old = kontenList.find((k) => k.id === editId)?.file_url;
                    return old ? (
                      <div className="mt-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <p className="text-sm text-gray-700 mb-1 font-medium">File PDF saat ini:</p>
                        <a
                          href={toAbsolute(old)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-sm shadow hover:scale-105 transition">
                          <Download className="h-4 w-4" />
                          Lihat / Download PDF Lama
                        </a>
                      </div>
                    ) : null;
                  })()
                )}
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((s) => ({ ...s, deskripsi: v }));
                    if (!v.trim()) setErrors((s) => ({ ...s, deskripsi: "Deskripsi wajib diisi." }));
                    else setErrors((s) => ({ ...s, deskripsi: undefined }));
                  }}
                  placeholder="Tulis deskripsi singkat tentang konten..."
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${
                    errors.deskripsi
                      ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  }`}
                />
                {errors.deskripsi && <p className="text-xs text-rose-600">{errors.deskripsi}</p>}
              </div>

              {/* Tombol Batal dan Submit */}
              <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100">
                <button
                  onClick={() => setShow(false)}
                  disabled={submit}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold disabled:opacity-50 transition-all hover:scale-105">
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submit || !form.judul.trim() || form.judul.trim().length > MAX_TITLE || !form.deskripsi.trim()}
                  className={`flex-1 rounded-xl py-3 font-semibold transition-all hover:scale-105 shadow-lg text-white ${
                    submit || !form.judul.trim() || form.judul.trim().length > MAX_TITLE || !form.deskripsi.trim()
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  }`}
                >
                  {submit ? "Menyimpan..." : editMode ? "Simpan" : "Tambah"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirm && (
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
                  {confirm.title}
                </span>
              </p>
              <p className="text-xs text-gray-500">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="px-5 py-4 flex items-center justify-end gap-3 border-t-2 border-gray-100">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 rounded-xl border-2 border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold transition-all">
                Batal
              </button>
              <button
                onClick={async () => {
                  await handleDelete(confirm.id);
                  setConfirm(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-rose-700 hover:shadow-lg transition-all">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}