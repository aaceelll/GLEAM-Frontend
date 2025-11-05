"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Search, Eye, Calendar } from "lucide-react";

/* ================= Types ================= */
type Review = {
  id: number;
  user: { id: number; nama: string; email: string };
  created_at: string;
  updated_at: string;
};

type ReviewDetail = Review & {
  q1?: number; q2?: number; q3?: number; q4?: number; q5?: number;
  q6?: number; q7?: number; q8?: number; q9?: number; q10?: number;
  suggestion?: string;
};

/* ================= Helpers ================= */
const TZ = "Asia/Jakarta";
function formatIDTime(input?: string) {
  if (!input) return "-";
  let s = String(input).trim();
  const isoish = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(s);
  if (isoish && !/[Z+-]\d{2}:?\d{2}$/.test(s)) s = s.replace(" ", "T") + "Z";

  const d = new Date(s);
  if (isNaN(d.getTime())) return "-";

  const tanggal = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);

  const jam = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);

  return `${tanggal} pukul ${jam}`;
}


const QUESTIONS: Record<string, string> = {
  q1: "Saya ingin menggunakan website ini secara rutin.",
  q2: "Website ini terasa tidak perlu rumit.",
  q3: "Website ini mudah digunakan.",
  q4: "Saya merasa membutuhkan bantuan teknis untuk bisa menggunakan website ini.",
  q5: "Fitur-fitur pada website ini terintegrasi dengan baik.",
  q6: "Website ini terasa tidak konsisten.",
  q7: "Saya yakin orang lain dapat belajar menggunakan website ini dengan cepat.",
  q8: "Website ini terasa membingungkan atau canggung.",
  q9: "Saya percaya diri menggunakan website ini.",
  q10: "Saya perlu mempelajari banyak hal sebelum dapat menggunakan website ini.",
};

const SCALE_LABELS: Record<number, string> = {
  1: "Sangat Tidak Setuju",
  2: "Tidak Setuju",
  3: "Netral",
  4: "Setuju",
  5: "Sangat Setuju",
};

const SCALE_COLORS: Record<number, string> = {
  1: "bg-red-100 text-red-700 border-red-300",
  2: "bg-orange-100 text-orange-700 border-orange-300",
  3: "bg-yellow-100 text-yellow-700 border-yellow-300",
  4: "bg-lime-100 text-lime-700 border-lime-300",
  5: "bg-emerald-100 text-emerald-700 border-emerald-300",
};

/* ================= Page ================= */
export default function UlasanPage() {
  const router = useRouter();

  const [rows, setRows] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Review["user"] | null>(null);
  const [reviewHistory, setReviewHistory] = useState<ReviewDetail[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewDetail | null>(null);

  // pagination
  const perPage = 10;
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/manajemen/website-reviews");
      const data: Review[] = res?.data?.data?.data || [];
      setRows(data);
    } catch {
      toast.error("Gagal memuat data ulasan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const q = search.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      q
        ? rows.filter(
            (r) =>
              r.user.nama.toLowerCase().includes(q) ||
              r.user.email.toLowerCase().includes(q)
          )
        : rows,
    [q, rows]
  );

  useEffect(() => setPage(1), [q]); // reset page saat filter

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const currentRows = filtered.slice(start, end);

  /* ========== Modal Functions ========== */
  async function openReviewModal(user: Review["user"]) {
    try {
      const res = await api.get(`/manajemen/website-reviews/user/${user.id}/history`);
      setSelectedUser(user);
      setReviewHistory(res.data.data || []);
      setReviewModalOpen(true);
    } catch {
      toast.error("Gagal memuat riwayat ulasan");
    }
  }

  async function openDetailModal(id: number) {
    try {
      const res = await api.get(`/manajemen/website-reviews/${id}`);
      setSelectedReview(res.data.data);
      setDetailModalOpen(true);
    } catch {
      toast.error("Gagal memuat detail ulasan");
    }
  }

  function closeDetailModal() {
    setDetailModalOpen(false);
    setReviewModalOpen(false); // auto-close modal utama
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
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-[22px] leading-[1.15] sm:text-3xl md:text-4xl font-bold text-gray-800">
                Ulasan Website
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-0.5">Kelola Feedback Pengguna GLEAM</p>
            </div>
          </div>
        </div>

        {/* Card Tabel */}
        <Card className="rounded-3xl border-2 border-gray-100 shadow-2xl">
          <CardContent className="p-0">
            {/* Toolbar */}
            <div className="p-5 md:p-6 border-b-2 border-gray-100 flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama pengguna"
                  className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div className="md:ml-auto">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-100 bg-white/80 backdrop-blur shadow-sm">
                  <span className="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">Total Ulasan</span>
                  <span className="text-sm font-bold text-gray-900">{filtered.length}</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full min-w-[640px] border-collapse text-sm md:text-base table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="pl-12 py-3 text-left font-semibold text-gray-700 border-b w-16">No</th>
                    <th className="py-3 text-left font-semibold text-gray-700 border-b">Nama</th>
                    <th className="py-3 text-left font-semibold text-gray-700 border-b">Tanggal Review</th>
                    <th className="py-3 text-center font-semibold text-gray-700 border-b">Email</th>
                    <th className="pr-15 py-3 text-right font-semibold text-gray-700 border-b w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <div className="inline-flex items-center gap-2 text-gray-500">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin" />
                          <span>Memuat data…</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500">
                        {q ? "Tidak ada hasil." : "Belum ada ulasan."}
                      </td>
                    </tr>
                  ) : (
                    currentRows.map((r, idx) => (
                      <tr
                        key={r.id}
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-colors"
                      >
                        <td className="pl-12 py-4 text-sm text-gray-600">{start + idx + 1}</td>
                        <td className="py-4 px-2 text-sm font-medium text-gray-900 break-words max-w-[200px]">{r.user.nama}</td>
                        <td className="py-4 px-2 text-sm text-gray-600 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="truncate">{formatIDTime(r.created_at)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-sm text-gray-600 text-center break-all max-w-[250px]">{r.user.email}</td>
                        <td className="pr-11 py-4 text-right">
                          <button
                            onClick={() => openReviewModal(r.user)}
                            className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                          >
                            <Eye className="w-4 h-4" />
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Riwayat */}
      {reviewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center p-4 animate-[fadeIn_0.25s_ease,slideUp_0.3s_ease]">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Riwayat Review</h2>
                <p className="text-sm text-gray-600">{selectedUser.nama} • {selectedUser.email}</p>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >✕</button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {reviewHistory.length === 0 ? (
                <p className="text-center text-gray-500 italic py-10">Belum ada ulasan</p>
              ) : (
                reviewHistory.map((rev, idx) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-lg border-2 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white grid place-items-center font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {formatIDTime(rev.created_at)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        onClick={() => openDetailModal(rev.id)}
                      >
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {detailModalOpen && selectedReview && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 animate-[fadeIn_0.25s_ease,slideUp_0.3s_ease]">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <h2 className="font-semibold text-gray-900">Detail Ulasan</h2>
              </div>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >✕</button>
            </div>
            <div className="p-6 space-y-3 overflow-y-auto max-h-[70vh]">
              {Object.entries(QUESTIONS).map(([key, label], idx) => {
                const value = (selectedReview as any)[key];
                const hasAnswer = value !== undefined && value !== null;
                return (
                  <div 
                    key={key} 
                    className={`rounded-lg p-4 border transition-all ${
                      hasAnswer 
                        ? 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-sm' 
                        : 'bg-gray-50/50 border-gray-100'
                    }`}
                  >
                    <p className="text-sm text-gray-700 leading-relaxed mb-2.5">
                      <span className="font-medium text-gray-900">{idx + 1}.</span> {label}
                    </p>
                    <div className="flex items-center gap-2">
                      {hasAnswer ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${SCALE_COLORS[value]}`}>
                          {SCALE_LABELS[value]}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Tidak dijawab</span>
                      )}
                    </div>
                  </div>
                );
              })}
              
              <div className="pt-2">
                <div className={`rounded-lg p-4 border transition-all ${
                  selectedReview.suggestion?.trim() 
                    ? 'bg-emerald-50/30 border-emerald-200/50' 
                    : 'bg-gray-50/50 border-gray-100'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <p className="font-medium text-gray-900 text-sm">Saran & Masukan</p>
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    selectedReview.suggestion?.trim() 
                      ? 'text-gray-700' 
                      : 'text-gray-400'
                  }`}>
                    {selectedReview.suggestion?.trim() || "Tidak ada saran"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}