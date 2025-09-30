"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Download, ExternalLink, FileText } from "lucide-react";

type Konten = {
  id: string;
  judul: string;
  deskripsi: string;
  video_id: string | null;
  file_url: string;
  created_at: string;
  updated_at: string;
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

  return (
    <div className="px-6 md:px-10 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Materi Edukasi Diabetes Melitus
          </h1>
          <p className="text-gray-600 mt-1">
            Pelajari tentang Diabetes Melitus melalui materi dan video edukasi
          </p>
        </header>

        {err && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3.5 shadow-sm">
            <p className="font-medium text-sm">{err}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-6 py-4 border-b bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Daftar Konten</h2>
            <p className="text-sm text-gray-600 mt-0.5">{items.length} konten tersedia</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-emerald-600 mb-3"></div>
                <p className="text-sm text-gray-500">Memuat materi...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-1">Belum ada materi</p>
                <p className="text-sm text-gray-500">Materi sedang dalam proses pembuatan</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {items.map((it, i) => (
                  <div
                    key={it.id}
                    className="border-2 border-gray-100 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center min-w-[2.5rem] h-10 rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-sm">
                        {i + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-xl mb-2">{it.judul}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{it.deskripsi}</p>

                        <div className="flex items-center gap-3 mb-3">
                          <a
                            href={it.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <Download className="h-4 w-4" />
                            PDF
                          </a>
                          {it.video_id && (
                            <a
                              href={`https://www.youtube.com/watch?v=${it.video_id}`}
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
                          <span>Dibuat: {new Date(it.created_at).toLocaleDateString("id-ID")}</span>
                          <span>•</span>
                          <span>Diubah: {new Date(it.updated_at).toLocaleDateString("id-ID")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}