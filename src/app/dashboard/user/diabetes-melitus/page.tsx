"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink, FileText, Video, Calendar, Clock } from "lucide-react";

type Konten = {
  id: string;
  judul: string;
  deskripsi: string;
  video_id: string | null;
  file_url: string;
  created_at: string;
  updated_at: string;
};

// Mock API untuk demo
const api = {
  get: async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: {
        data: [
          {
            id: "1",
            judul: "Pengenalan Diabetes Melitus",
            deskripsi: "Pelajari dasar-dasar diabetes melitus, mulai dari definisi, jenis-jenis diabetes, hingga faktor risiko yang perlu Anda ketahui untuk pencegahan dini.",
            video_id: "dQw4w9WgXcQ",
            file_url: "#",
            created_at: "2024-01-15T10:00:00Z",
            updated_at: "2024-01-20T15:30:00Z"
          },
          {
            id: "2",
            judul: "Gejala dan Diagnosis Diabetes",
            deskripsi: "Kenali gejala-gejala diabetes sejak dini dan pahami prosedur diagnosis yang tepat untuk deteksi diabetes melitus.",
            video_id: null,
            file_url: "#",
            created_at: "2024-02-10T09:00:00Z",
            updated_at: "2024-02-12T11:00:00Z"
          },
          {
            id: "3",
            judul: "Pola Makan Sehat untuk Diabetesi",
            deskripsi: "Panduan lengkap mengatur pola makan yang tepat, memilih makanan sehat, dan mengontrol kadar gula darah melalui nutrisi yang seimbang.",
            video_id: "abc123xyz",
            file_url: "#",
            created_at: "2024-03-05T14:00:00Z",
            updated_at: "2024-03-08T16:45:00Z"
          }
        ]
      }
    };
  }
};

export default function DiabetesMelitusPage() {
  const [items, setItems] = useState<Konten[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/materi/konten?slug=diabetes-melitus");
        setItems(res.data?.data ?? []);
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
    "from-rose-500 to-pink-500"
  ];

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent">
            Materi Edukasi Diabetes Melitus
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Pelajari tentang Diabetes Melitus melalui materi dan video edukasi yang mudah dipahami
          </p>
        </header>

        {err && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800 rounded-2xl px-5 py-4 shadow-lg">
            <p className="font-semibold text-sm">{err}</p>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                  Daftar Konten
                </h2>
                <p className="text-sm text-gray-600 mt-1 ml-4">{items.length} konten tersedia untuk dipelajari</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{items.length} Materi</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block relative">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-teal-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-4 font-medium">Memuat materi edukasi...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-inner">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-700 font-bold text-lg mb-2">Belum ada materi</p>
                <p className="text-sm text-gray-500">Materi edukasi sedang dalam proses pembuatan</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {items.map((it, i) => (
                  <div
                    key={it.id}
                    className="group relative bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradients[i % gradients.length]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    
                    {/* Decorative Corner */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradients[i % gradients.length]} opacity-5 rounded-bl-full`}></div>
                    
                    <div className="relative flex items-start gap-5">
                      {/* Number Badge */}
                      <div className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[i % gradients.length]} text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {i + 1}
                      </div>

                      <div className="flex-1 min-w-0 space-y-4">
                        {/* Title */}
                        <h3 className="font-bold text-gray-900 text-2xl group-hover:text-emerald-700 transition-colors">
                          {it.judul}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-base leading-relaxed">
                          {it.deskripsi}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={it.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-xl hover:scale-105 font-semibold text-sm"
                          >
                            <Download className="h-4 w-4" />
                            Unduh PDF
                          </a>
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

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="font-medium">Dibuat: {new Date(it.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-blue-600" />
                            <span className="font-medium">Diperbarui: {new Date(it.updated_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">
            💡 Tip: Unduh materi PDF untuk belajar offline dan tonton video untuk pemahaman yang lebih interaktif
          </p>
        </div>
      </div>
    </div>
  );
}