"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Pencil, Trash2, FileText, Video, CheckCircle2, AlertCircle, Download, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";

type Konten = {
  id: string;
  judul: string;
  video_id: string | null;
  file_url: string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
};

export default function MateriPage() {
  const [kontenList, setKontenList] = useState<Konten[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
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
    setFormData({ judul: "", video_id: "", tanpa_video: false, file_pdf: null, deskripsi: "" });
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("judul", formData.judul);
    data.append("video_id", formData.tanpa_video ? "" : formData.video_id);
    if (formData.file_pdf) data.append("file_pdf", formData.file_pdf);
    data.append("deskripsi", formData.deskripsi);

    try {
      if (editMode && editId) {
        await api.post(`/admin/materi/konten/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg({ type: "success", text: "Konten berhasil diperbarui!" });
      } else {
        await api.post("/admin/materi/konten", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg({ type: "success", text: "Konten berhasil ditambahkan!" });
      }
      setShowModal(false);
      fetchKonten();
      setTimeout(() => setMsg(null), 3000);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Gagal menyimpan konten.";
      setMsg({ type: "error", text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(kontenId: string) {
    if (!confirm("Yakin ingin menghapus konten ini?")) return;
    try {
      await api.delete(`/admin/materi/konten/${kontenId}`);
      setMsg({ type: "success", text: "Konten berhasil dihapus!" });
      fetchKonten();
      setTimeout(() => setMsg(null), 3000);
    } catch (error) {
      setMsg({ type: "error", text: "Gagal menghapus konten." });
    }
  }

  return (
    <div className="px-6 md:px-10 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Materi Edukasi</h1>
            <p className="text-gray-600 mt-1">Kelola konten materi Diabetes Melitus</p>
          </div>
          <Button
            onClick={openAddModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 px-5 py-2.5 shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Tambah Konten
          </Button>
        </header>

        {/* Notification */}
        {msg && (
          <div
            className={`rounded-xl px-4 py-3.5 flex items-start gap-3 shadow-sm ${
              msg.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                : "bg-red-50 border border-red-200 text-red-900"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="font-medium text-sm">{msg.text}</span>
          </div>
        )}

        {/* Content List */}
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-6 py-4 border-b bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Daftar Konten</h2>
            <p className="text-sm text-gray-600 mt-0.5">{kontenList.length} konten tersedia</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-emerald-600 mb-3"></div>
                <p className="text-sm text-gray-500">Memuat konten...</p>
              </div>
            ) : kontenList.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-1">Belum ada konten</p>
                <p className="text-sm text-gray-500">Klik "Tambah Konten" untuk memulai</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {kontenList.map((konten, index) => (
                  <div
                    key={konten.id}
                    className="border-2 border-gray-100 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center min-w-[2.5rem] h-10 rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-sm">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-xl mb-2">{konten.judul}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{konten.deskripsi}</p>

                        <div className="flex items-center gap-3 mb-3">
                          <a
                            href={konten.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <Download className="h-4 w-4" />
                            PDF
                          </a>
                          {konten.video_id && (
                            <a
                              href={`https://www.youtube.com/watch?v=${konten.video_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors text-sm font-medium"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Video
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Dibuat: {new Date(konten.created_at).toLocaleDateString("id-ID")}</span>
                          <span>•</span>
                          <span>Diubah: {new Date(konten.updated_at).toLocaleDateString("id-ID")}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => openEditModal(konten)}
                          className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(konten.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
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

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editMode ? "Edit Konten" : "Tambah Konten"}
                  </h2>
                  <p className="text-emerald-100 text-sm mt-0.5">
                    {editMode ? "Perbarui informasi konten" : "Lengkapi formulir di bawah"}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-88px)]">
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-900 text-sm">
                    Judul Konten <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    placeholder="Contoh: Pengenalan Diabetes Melitus"
                    className="px-4 py-2.5 rounded-xl border-2 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-gray-900 text-sm">
                    Video ID YouTube {!formData.tanpa_video && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    required={!formData.tanpa_video}
                    disabled={formData.tanpa_video}
                    value={formData.video_id}
                    onChange={(e) => setFormData({ ...formData, video_id: e.target.value })}
                    placeholder="Contoh: y55Wupx2ZDU"
                    className="px-4 py-2.5 rounded-xl border-2 focus:border-emerald-500 disabled:bg-gray-100"
                  />
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      💡 <strong>Contoh:</strong> https://youtube.com/watch?v=<span className="font-mono bg-blue-100 px-1">y55Wupx2ZDU</span>
                      <br />Masukkan hanya: <span className="font-mono bg-blue-100 px-1">y55Wupx2ZDU</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border">
                  <input
                    type="checkbox"
                    id="tanpa_video"
                    checked={formData.tanpa_video}
                    onChange={(e) =>
                      setFormData({ ...formData, tanpa_video: e.target.checked, video_id: "" })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-0.5"
                  />
                  <label htmlFor="tanpa_video" className="text-sm text-gray-700 cursor-pointer">
                    <strong>Konten tanpa video YouTube</strong>
                    <br />
                    <span className="text-gray-500 text-xs">Video ID akan diabaikan jika dicentang</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-gray-900 text-sm">
                    File PDF {!editMode && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    required={!editMode}
                    onChange={(e) =>
                      setFormData({ ...formData, file_pdf: e.target.files?.[0] || null })
                    }
                    className="px-4 py-2.5 rounded-xl border-2 focus:border-emerald-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:text-sm file:font-medium hover:file:bg-emerald-100"
                  />
                  {editMode && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      ⚠️ Kosongkan jika tidak ingin mengubah file
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-gray-900 text-sm">
                    Deskripsi <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    required
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    placeholder="Tulis deskripsi singkat tentang konten..."
                    rows={5}
                    className="px-4 py-3 rounded-xl border-2 focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-2.5 font-semibold disabled:opacity-50"
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl py-2.5 font-semibold disabled:opacity-50"
                  >
                    {submitting ? "Menyimpan..." : editMode ? "Simpan" : "Tambah"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}