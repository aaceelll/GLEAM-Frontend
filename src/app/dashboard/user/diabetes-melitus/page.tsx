"use client";

import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  Video,
  Calendar,
  Clock,
  ListChecks,
  ClipboardList,
  Play,
} from "lucide-react";
import { api } from "@/lib/api";

/* ================= Types ================= */
type MateriItem = {
  id: string | number;
  judul: string;
  deskripsi: string;
  video_id?: string | null;
  file_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

type TesItem = {
  id: string | number;
  nama: string;
  deskripsi?: string | null;
  totalSoal?: number;
  durasiMenit?: number | null;
  bank_id?: number;
  [key: string]: any;
};

/* ============== Page ============== */
export default function DiabetesMelitusPage() {
  const [konten, setKonten] = useState<MateriItem[]>([]);
  const [tes, setTes] = useState<TesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/materi/konten", {
          params: { slug: "diabetes-melitus" },
        });

        // response di-backend: { konten: [...], tes: [...] }
        const root = (res.data?.data ?? res.data ?? {}) as any;

        const rawKonten: any[] =
          root.konten ?? root.materi ?? root.items ?? root ?? [];

        const mappedKonten: MateriItem[] = Array.isArray(rawKonten)
          ? rawKonten.map((it: any) => ({
              id: it.id ?? it.ID ?? it.uuid ?? String(Math.random()),
              judul: it.judul ?? it.title ?? "Tanpa Judul",
              deskripsi: it.deskripsi ?? it.description ?? "",
              video_id: it.video_id ?? it.videoId ?? null,
              file_url: it.file_url ?? it.fileUrl ?? null,
              created_at: it.created_at ?? it.createdAt ?? undefined,
              updated_at: it.updated_at ?? it.updatedAt ?? undefined,
            }))
          : [];

        const rawTes: any[] = root.tes ?? root.tests ?? root.kuisioner ?? [];
        const mappedTes: TesItem[] = Array.isArray(rawTes)
          ? rawTes.map((t: any) => ({
              id: t.id ?? t.test_id ?? t.uuid ?? String(Math.random()),
              nama: t.nama ?? t.title ?? "Kuisioner",
              deskripsi: t.deskripsi ?? t.description ?? null,
              totalSoal:
                t.totalSoal ?? t.total_soal ?? t.jumlah_soal ?? undefined,
              durasiMenit: t.durasiMenit ?? t.duration ?? t.durasi ?? null,
              bank_id: t.bank_id ?? t.bankId ?? undefined,
              ...t,
            }))
          : [];

        setKonten(mappedKonten);
        setTes(mappedTes);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Gagal memuat materi.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-rose-500 to-pink-500",
  ];

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header kecil, rata kiri */}
        <header className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Edukasi Diabetes Melitus
              </h1>
              <p className="text-sm text-gray-600">
                Materi dan kuisioner edukasi yang mudah dipahami
              </p>
            </div>
          </div>
        </header>

        {/* Error */}
        {err && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800 rounded-2xl px-5 py-4 shadow-lg">
            <p className="font-semibold text-sm">{err}</p>
          </div>
        )}

        {/* ====== KUISONER / TES ====== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full"></span>
                  Kuisioner / Tes
                </h2>
                <p className="text-sm text-gray-600 mt-1 ml-4">
                  {loading ? "Memuat…" : `${tes.length} kuisioner tersedia`}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  {tes.length} Kuisioner
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block relative">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4 font-medium">
                  Memuat kuisioner…
                </p>
              </div>
            ) : tes.length === 0 ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-3">
                  <ClipboardList className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">
                  Belum ada kuisioner untuk materi ini
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {tes.map((t, i) => (
                  <div
                    key={t.id}
                    className="group relative bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-transparent hover:shadow-2xl transition-all overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${
                        gradients[i % gradients.length]
                      } opacity-0 group-hover:opacity-5 transition-opacity`}
                    />
                    <div
                      className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${
                        gradients[i % gradients.length]
                      } opacity-5 rounded-bl-full`}
                    />

                    <div className="relative flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${
                          gradients[i % gradients.length]
                        } text-white font-bold shadow`}
                      >
                        <ListChecks className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-snug">
                              {t.nama}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {t.totalSoal ?? "-"} soal
                              {t.durasiMenit ? ` • ${t.durasiMenit} menit` : ""}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              (window.location.href = `/dashboard/user/kuisioner/${t.id}`)
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all shadow hover:shadow-lg text-sm font-semibold"
                          >
                            <Play className="h-4 w-4" />
                            Mulai
                          </button>
                        </div>

                        {t.deskripsi && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2 break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
                            {t.deskripsi}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ====== DAFTAR KONTEN ====== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                  Daftar Konten
                </h2>
                <p className="text-sm text-gray-600 mt-1 ml-4">
                  {loading
                    ? "Memuat…"
                    : `${konten.length} konten tersedia untuk dipelajari`}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  {konten.length} Materi
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block relative">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4 font-medium">
                  Memuat materi edukasi…
                </p>
              </div>
            ) : konten.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-inner">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-700 font-bold text-lg mb-2">
                  Belum ada materi
                </p>
                <p className="text-sm text-gray-500">
                  Materi edukasi sedang dalam proses pembuatan
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {konten.map((it, i) => (
                  <div
                    key={it.id}
                    className="group relative bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${
                        gradients[i % gradients.length]
                      } opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    ></div>
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${
                        gradients[i % gradients.length]
                      } opacity-5 rounded-bl-full`}
                    ></div>

                    <div className="relative flex items-start gap-5">
                      <div
                        className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${
                          gradients[i % gradients.length]
                        } text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        {i + 1}
                      </div>

                      <div className="flex-1 min-w-0 space-y-4">
                        <h3 className="font-bold text-gray-900 text-2xl group-hover:text-emerald-700 transition-colors">
                          {it.judul}
                        </h3>

                        <p className="text-gray-600 text-base leading-relaxed break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
                          {it.deskripsi}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          {it.file_url && (
                            <a
                              href={it.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-xl hover:scale-105 font-semibold text-sm"
                            >
                              <Download className="h-4 w-4" />
                              Unduh PDF
                            </a>
                          )}
                          {it.video_id && (
                            <a
                              href={`https://www.youtube.com/watch?v=${it.video_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-xl hover:scale-105 font-semibold text-sm"
                            >
                              <Video className="h-4 w-4" />
                              Tonton Video
                            </a>
                          )}
                        </div>

                        {(it.created_at || it.updated_at) && (
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                            {it.created_at && (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="font-medium">
                                  Dibuat:{" "}
                                  {new Date(it.created_at).toLocaleDateString(
                                    "id-ID",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                            )}
                            {it.updated_at && (
                              <>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                                  <span className="font-medium">
                                    Diperbarui:{" "}
                                    {new Date(it.updated_at).toLocaleDateString(
                                      "id-ID",
                                      {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      }
                                    )}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        )}
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
            💡 Tip: Unduh materi PDF untuk belajar offline dan tonton video untuk
            pemahaman yang lebih interaktif
          </p>
        </div>
      </div>
    </div>
  );
}
