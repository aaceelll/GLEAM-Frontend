"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Search, Calendar, X, ClipboardList, CheckCircle, XCircle, Eye, Percent } from "lucide-react";
import { api } from "@/lib/api";

/* ============ Types ============ */
type TabKey = "pre" | "post";

type Row = {
  userId: string | number;
  name: string;
  latestDate: string;
  latestScore: number;
  count: number; // jumlah submission user ini
  type: "pre" | "post";
};

type HistoryItem = {
  id: string | number;
  bankName: string;
  date: string;
  score: number;
  total_score: number;
  max_score: number;
};

type Review = {
  soal_id: number;
  teks: string;
  tipe: string;
  user_answer_text: string;
  user_score: number;
  correct_answer_text: string;
  correct_score: number;
  is_correct: boolean;
};

type SubmissionDetail = {
  id?: string | number;
  type?: "pre" | "post";
  nama?: string;
  bank_name?: string;
  submitted_at?: string;
  percentage?: number;
  total_score?: number;
  max_score?: number;
  answers?: any;
  review?: Review[];
};

/* ============ Helpers ============ */
const TZ = "Asia/Jakarta";

function formatIDTime(input?: string) {
  if (!input) return "-";
  let s = String(input).trim();
  const hasOffset = /[+-]\d{2}:\d{2}$/.test(s);
  const hasZ = /Z$/.test(s);
  const isoish = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(s);
  if (isoish && !hasOffset && !hasZ) s = s.replace(" ", "T") + "Z";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function coerceArray(root: any): any[] {
  if (!root) return [];
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.data)) return root.data;
  return [];
}

/* ====== Endpoints ====== */
const LIST_PATH = "/manajemen/quiz/submissions";
const DETAIL_PATH = "/manajemen/quiz/submissions";

/* ============ Modal Review Jawaban ============ */
function ReviewModal({ open, onClose, data }: { open: boolean; onClose: () => void; data?: SubmissionDetail | null; }) {
  if (!open) return null;

  const d = data ?? {};
  const review = d.review || [];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* overflow-hidden mencegah isi "kotak" keluar dari radius */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-white border-2 border-gray-100 shadow-2xl overflow-hidden">
        {/* gunakan svh agar nyaman di iOS Safari, plus padding agar tidak nempel */}
        <div className="max-h-[85svh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-4 border-b bg-white">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 grid place-items-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Review Jawaban - {d.type === "post" ? "Post Test" : "Pre Test"}
                </p>
                <p className="text-xs text-gray-600">{d.nama} - {d.bank_name}</p>
              </div>
            </div>
            <button
              aria-label="Tutup"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Summary Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { k: "Nama", v: d.nama ?? "-" },
                { k: "Bank Soal", v: d.bank_name ?? "-" },
                { k: "Jenis Tes", v: d.type === "post" ? "Post Test" : "Pre Test" },
                { k: "Tanggal", v: formatIDTime(d.submitted_at) },
                {
                  k: "Skor",
                  v:
                    d.percentage != null
                      ? `${Math.round(d.percentage)}%`
                      : d.total_score != null && d.max_score != null
                      ? `${d.total_score} / ${d.max_score}`
                      : "-",
                },
              ].map((it) => (
                <div key={it.k} className="rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">{it.k}</p>
                  <p className="mt-1 font-semibold text-gray-900">{it.v}</p>
                </div>
              ))}
            </div>

            {/* Review Jawaban */}
            <div className="rounded-2xl border-2 border-gray-100">
              <div className="px-5 py-3 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
                <p className="text-sm font-semibold text-gray-700">Detail Jawaban</p>
              </div>
              <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
                {review.length > 0 ? (
                  review.map((r, idx) => (
                    <div
                      key={r.soal_id}
                      className={`rounded-xl border-2 p-4 ${
                        r.is_correct
                          ? "border-emerald-200 bg-emerald-50/50"
                          : "border-rose-200 bg-rose-50/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {r.is_correct ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-semibold text-gray-900">
                            Soal {idx + 1}: {r.teks}
                          </p>
                          <div className="text-xs space-y-1">
                            <p>
                              <span className="font-medium text-gray-700">Jawaban Anda:</span>{" "}
                              <span className="text-gray-900">{r.user_answer_text}</span>
                              <span className="ml-2 text-gray-600">(Skor: {r.user_score})</span>
                            </p>
                            {!r.is_correct && (
                              <p>
                                <span className="font-medium text-gray-700">Jawaban Benar:</span>{" "}
                                <span className="text-gray-900">{r.correct_answer_text}</span>
                                <span className="ml-2 text-gray-600">(Skor: {r.correct_score})</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-center py-8">Tidak ada data review.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ Modal Riwayat User ============ */
function HistoryModal({
  open,
  onClose,
  userName,
  userId,
  type,
  onSelectHistory,
}: {
  open: boolean;
  onClose: () => void;
  userName: string;
  userId: string | number;
  type: "pre" | "post";
  onSelectHistory: (id: string | number) => void;
}) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && userId) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, userId, type]);

  async function fetchHistory() {
    setLoading(true);
    try {
      const res = await api.get(LIST_PATH, { params: { tipe: type } });
      const all = coerceArray(res?.data ?? res);
      
      // Filter hanya submission dari user ini
      const userSubmissions = all
        .filter((x: any) => x.user_id === userId)
        .map((x: any) => ({
          id: x.id,
          bankName: x.bank_name || "-",
          date: x.submitted_at || "",
          score: Math.round(x.percentage || 0),
          total_score: x.total_score || 0,
          max_score: x.max_score || 0,
        }));

      setHistory(userSubmissions);
    } catch (e) {
      console.error("Error loading history:", e);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
     <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl bg-white border-2 border-gray-100 shadow-2xl overflow-hidden">
        <div className="max-h-[80svh] sm:max-h-[85svh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-4 border-b bg-white">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 grid place-items-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Riwayat {type === "post" ? "Post Test" : "Pre Test"}</p>
                <p className="text-xs text-gray-600">{userName}</p>
              </div>
            </div>
            <button
              aria-label="Tutup"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 text-gray-500">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin" />
                  <span>Memuat riwayat…</span>
                </div>
              </div>
            ) : history.length === 0 ? (
              <p className="text-center py-12 text-gray-500">Tidak ada riwayat.</p>
            ) : (
              <div className="space-y-3">
                {history.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all overflow-hidden"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-700">{idx + 1}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{item.bankName}</p>

                      {/* flex-wrap + gap seragam bikin rapi di mobile */}
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <span className="opacity-60">•</span>
                          {formatIDTime(item.date)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-gray-600">
                          <span className="opacity-60">•</span>
                          Skor: {item.total_score}/{item.max_score}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          item.score >= 80
                            ? "bg-emerald-100 text-emerald-700"
                            : item.score >= 60
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {item.score}%
                      </span>
                      <button
                        onClick={() => onSelectHistory(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Lihat
                      </button>
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

/* ============ Page ============ */
export default function LaporanKeseluruhan() {
  const [tab, setTab] = useState<TabKey>("pre");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // modal states
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string | number; name: string } | null>(null);
  
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState<SubmissionDetail | null>(null);

  /* --- FETCHERS --- */
  async function fetchList(current: TabKey = tab) {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get(LIST_PATH, { params: { tipe: current } });
      const all = coerceArray(res?.data ?? res);

      // Group by user_id
      const grouped = all.reduce((acc: any, item: any) => {
        const userId = item.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            userId,
            name: item.nama || "Tanpa Nama",
            submissions: [],
          };
        }
        acc[userId].submissions.push(item);
        return acc;
      }, {});

      // Convert to array and get latest data
      const userRows: Row[] = Object.values(grouped).map((user: any) => {
        const sorted = user.submissions.sort((a: any, b: any) => 
          new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
        );
        const latest = sorted[0];

        return {
          userId: user.userId,
          name: user.name,
          latestDate: latest.submitted_at || "",
          latestScore: Math.round(latest.percentage || 0),
          count: user.submissions.length,
          type: current,
        };
      });

      setRows(userRows);
    } catch (e) {
      console.error("API ERROR list:", e);
      setErrorMsg("Gagal memuat data.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchReviewDetail(id: string | number) {
    try {
      const res = await api.get(`${DETAIL_PATH}/${id}`);
      const submission = res?.data?.submission ?? res?.data ?? {};
      const review = res?.data?.review ?? [];

      setReviewData({
        id: submission.id,
        type: submission.tipe === "post" ? "post" : "pre",
        nama: submission.nama,
        bank_name: submission.bank_name,
        submitted_at: submission.submitted_at,
        percentage: submission.percentage,
        total_score: submission.total_score,
        max_score: submission.max_score,
        answers: submission.answers,
        review: review,
      });
      setHistoryOpen(false); // tutup modal history
      setReviewOpen(true); // buka modal review
    } catch (e) {
      console.error("API ERROR detail:", e);
      setReviewData(null);
    }
  }

  function handleOpenHistory(userId: string | number, userName: string) {
    setSelectedUser({ id: userId, name: userName });
    setHistoryOpen(true);
  }

  /* --- AUTO LOAD --- */
  useEffect(() => {
    fetchList("pre");
  }, []);

  useEffect(() => {
    fetchList(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  /* --- FILTER --- */
  const q = search.trim().toLowerCase();
  const filtered = useMemo(
    () => (q ? rows.filter((r) => r.name?.toLowerCase().includes(q)) : rows),
    [q, rows]
  );

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
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

             {/* Judul + subjudul */}
            <div>
              <h1 className="text-[22px] leading-[1.15] sm:text-3xl md:text-4xl font-bold text-gray-800">
                Laporan Keseluruhan<br className="hidden sm:block" />
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-0.5">
                Riwayat Pre Test & Post Test
              </p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-800 px-4 py-3">
            {errorMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 p-1 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-100 shadow-lg">
          {[
            { key: "pre", label: "Pre Test" },
            { key: "post", label: "Post Test" },
          ].map((t) => {
            const isActive = tab === (t.key as TabKey);
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key as TabKey)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 
                  ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.03]"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 hover:shadow-md"
                  }`}
              >
                {t.label}
              </button>
            );
          })}
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

              {/* total */}
              <div className="md:ml-auto">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-100 bg-white/80 backdrop-blur shadow-sm">
                  <span className="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">
                    Total {tab === "pre" ? "Pre Test" : "Post Test"}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{filtered.length}</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full min-w-[640px] border-collapse text-sm md:text-base table-fixed">
                <colgroup>
                  {/* Untuk layar besar (≥ md) */}
                  <col className="md:w-[18%] w-[22%]" />   {/* No */}
                  <col className="md:w-[18%] w-[22%]" />  {/* Nama */}
                  <col className="md:w-[18%] w-[22%]" />  {/* Tanggal */}
                  <col className="md:w-[18%] w-[22%]" />  {/* Skor */}
                  <col className="md:w-[18%] w-[22%]" />  {/* Aksi */}
                </colgroup>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="pl-12 py-3 text-left font-semibold text-gray-700 border-b">No</th>
                    <th className="py-3 text-left font-semibold text-gray-700 border-b">Nama</th>
                    <th className="py-3 text-left font-semibold text-gray-700 border-b">Tanggal Terbaru</th>
                    <th className="py-3 text-center font-semibold text-gray-700 border-b">Skor</th>
                    <th className="pr-15 py-3 text-right font-semibold text-gray-700 border-b">Aksi</th>
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
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500">
                        Tidak ada data.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row, idx) => (
                      <tr
                        key={row.userId}
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-colors"
                      >
                        <td className="pl-12 py-4 text-sm text-gray-600">{idx + 1}</td>
                        <td className="py-4 text-sm font-medium text-gray-900">
                          {row.name}
                          {row.count > 1 && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              {row.count}x
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatIDTime(row.latestDate)}
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              row.latestScore >= 80
                                ? "bg-emerald-100 text-emerald-700"
                                : row.latestScore >= 60
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {row.latestScore}%
                          </span>
                        </td>
                        <td className="pr-11 py-4 text-right">
                          <button
                            onClick={() => handleOpenHistory(row.userId, row.name)}
                            className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                            title="Lihat riwayat & detail"
                          >
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

      {/* Modal Riwayat User */}
      <HistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        userName={selectedUser?.name || ""}
        userId={selectedUser?.id || ""}
        type={tab}
        onSelectHistory={fetchReviewDetail}
      />

      {/* Modal Review Jawaban */}
      <ReviewModal 
        open={reviewOpen} 
        onClose={() => setReviewOpen(false)} 
        data={reviewData} 
      />
    </div>
    </div>
  );
}
