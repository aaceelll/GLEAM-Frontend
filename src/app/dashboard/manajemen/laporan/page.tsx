"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Search, Calendar, RotateCcw, X, ClipboardList } from "lucide-react";
import { api } from "@/lib/api";

/* ============ Types ============ */
type TabKey = "pre" | "post";

type Row = {
  id: string | number;
  userId?: string | number;
  name: string;
  date: string;      // ISO/string
  score: number;     // 0-100
  type: "pre" | "post";
};

type SubmissionDetail = {
  id?: string | number;
  type?: "pre" | "post";
  nama?: string;
  submitted_at?: string;
  percentage?: number;
  total_score?: number;
  max_score?: number;
  answers?: any;
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
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function first<T = any>(obj: any, keys: string[], fallback?: any): T | any {
  for (const k of keys) {
    const v = k.includes(".")
      ? k.split(".").reduce((acc: any, key) => (acc ? acc[key] : undefined), obj)
      : obj?.[k];
    if (v !== undefined && v !== null) return v;
  }
  return fallback;
}

function toPct(x: any, total?: any): number | undefined {
  const p = Number(String(x).replace("%", ""));
  if (Number.isFinite(p)) return p;
  const t = Number(total);
  if (Number.isFinite(t) && Number.isFinite(Number(x)) && t > 0) {
    return Math.round((Number(x) / t) * 100);
  }
  return undefined;
}

function coerceArray(root: any): any[] {
  if (!root) return [];
  // bentuk umum laravel
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.data)) return root.data;
  if (Array.isArray(root?.data?.data)) return root.data.data; // paginator
  if (Array.isArray(root?.items)) return root.items;
  if (Array.isArray(root?.results)) return root.results;
  if (Array.isArray(root?.rows)) return root.rows;
  return [];
}

function mapRow(x: any): Row {
  const id = first(x, ["id", "_id"]);
  const name =
    first(x, ["user.nama", "user.name"]) ??
    first(x, ["nama", "name"], "Tanpa Nama");
  const date = first(x, ["submitted_at", "created_at", "updated_at"]) ?? "";

  const percentage =
    toPct(first(x, ["percentage", "score", "persentase"]), first(x, ["max_score"])) ??
    toPct(Number(first(x, ["total_score"])), Number(first(x, ["max_score"]))) ??
    0;

  // backend pakai 'tipe' => 'pre' | 'post'
  const tRaw = String(first(x, ["tipe", "type", "quiz_type"], "pre")).toLowerCase();
  const type: "pre" | "post" = tRaw.includes("post") ? "post" : "pre";

  const userId = first(x, ["user_id", "userId", "user.id"]);
  return { id, name, date, score: Math.max(0, Math.min(100, Math.round(percentage))), type, userId };
}

function mapDetail(root: any): SubmissionDetail {
  const x = root?.data ?? root ?? {};
  const percentage = toPct(
    first(x, ["percentage", "score", "persentase"]),
    first(x, ["max_score"])
  ) ?? toPct(
    Number(first(x, ["total_score"])),
    Number(first(x, ["max_score"]))
  );

  return {
    id: first(x, ["id", "_id"]),
    type: (String(first(x, ["tipe", "type", "quiz_type"], "pre")).toLowerCase() === "post" ? "post" : "pre"),
    nama:
      first(x, ["user.nama"]) ??
      first(x, ["nama", "name", "user.name"]),
    submitted_at: first(x, ["submitted_at", "created_at"]),
    percentage: percentage,
    total_score: first(x, ["total_score"]),
    max_score: first(x, ["max_score"]),
    answers: first(x, ["answers", "jawaban", "detail"]),
  };
}

/* ====== Endpoints (sesuai route list kamu) ====== */
const LIST_PATH = "/quiz/history";     // GET list milik user login
const DETAIL_PATH = "/quiz/history";   // GET /quiz/history/{id}

/* ============ Modal Detail ============ */
function DetailModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data?: SubmissionDetail | null;
}) {
  if (!open) return null;

  const d = data ?? {};

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-3xl mx-4 rounded-2xl bg-white border-2 border-gray-100 shadow-2xl">
        <div className="max-h-[80vh] overflow-y-auto">
          {/* header */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 grid place-items-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-gray-900">
                Detail {d.type === "post" ? "Post Test" : "Pre Test"}
              </p>
            </div>
            <button
              aria-label="Tutup"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* body */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { k: "Nama", v: d.nama ?? "-" },
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

            {/* ringkas jawaban */}
            <div className="rounded-2xl border-2 border-gray-100">
              <div className="px-5 py-3 border-b">
                <p className="text-sm font-semibold text-gray-700">Ringkasan Jawaban</p>
              </div>
              <div className="p-5 text-sm text-gray-700">
                {d.answers ? (
                  <pre className="text-xs bg-gray-50 border border-gray-100 rounded-lg p-3 overflow-x-auto">
                    {typeof d.answers === "string"
                      ? d.answers
                      : JSON.stringify(d.answers, null, 2)}
                  </pre>
                ) : (
                  <p className="text-gray-500 italic">Tidak ada data jawaban.</p>
                )}
              </div>
            </div>
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

  // modal detail
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);

  /* --- FETCHERS --- */
  async function fetchList(current: TabKey = tab) {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get(LIST_PATH); // /quiz/history (semua)
      const all = coerceArray(res?.data ?? res).map(mapRow);
      const filtered = all.filter((r) => r.type === current);
      setRows(filtered);
    } catch (e: any) {
      console.error("API ERROR list:", e);
      setErrorMsg(e?.response?.data?.message || e?.message || "Gagal memuat riwayat tes.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(id: string | number) {
    setOpen(true);
    setDetail(null);
    try {
      const res = await api.get(`${DETAIL_PATH}/${id}`); // /quiz/history/:id
      setDetail(mapDetail(res?.data ?? res));
    } catch (e) {
      console.error("API ERROR detail:", e);
      setDetail({ id, type: tab, nama: "-", percentage: 0 });
    }
  }

  /* --- AUTO LOAD --- */
  useEffect(() => {
    // load pertama kali
    fetchList("pre");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // setiap tab berubah, refetch
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
    <div className="min-h-screen bg-white px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header seragam nakes */}
        <header className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Laporan Keseluruhan</h1>
            <p className="text-gray-600 mt-0.5">Riwayat Pre Test & Post Test</p>
          </div>

          {/* Refresh */}
          <button
            onClick={() => fetchList()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
                       border-2 border-gray-100 text-gray-600 bg-white
                       transition-all duration-300
                       hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50
                       hover:text-emerald-700 hover:shadow-md hover:scale-[1.02]"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh
          </button>
        </header>

        {errorMsg && (
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-800 px-4 py-3">
            {errorMsg}
          </div>
        )}

        {/* Tabs (Pre/Post) — gaya pills nakes */}
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
                  placeholder={`Cari nama di ${tab === "pre" ? "Pre Test" : "Post Test"}…`}
                  className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {/* total */}
              <div className="md:ml-auto">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-100 bg-white/80 backdrop-blur shadow-sm">
                  <span className="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">Total {tab === "pre" ? "Pre Test" : "Post Test"}</span>
                  <span className="text-sm font-bold text-gray-900">{filtered.length}</span>
                </div>
                <div className="sm:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white">
                  <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-900">{filtered.length}</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {["No", "Nama", "Tanggal", "Skor", "Aksi"].map((h, i) => (
                      <th
                        key={h}
                        className={[
                          "text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wide py-4 border-b-2 border-gray-100",
                          i === 0 ? "pl-6" : i === 4 ? "pr-6 text-right" : "",
                        ].join(" ")}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-gray-500">Memuat…</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-gray-500">Tidak ada data.</td>
                    </tr>
                  ) : (
                    filtered.map((r, i) => (
                      <tr
                        key={`${r.id}`}
                        className="border-b border-gray-50 hover:bg-emerald-50/50 transition-colors"
                      >
                        <td className="pl-6 py-4 font-semibold text-gray-900">{i + 1}</td>
                        <td className="py-4 font-semibold text-gray-900">{r.name}</td>
                        <td className="py-4 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatIDTime(r.date)}
                          </span>
                        </td>
                        <td className="py-4">
                          <ScoreChip value={r.score} />
                        </td>
                        <td className="py-4 pr-6">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => openDetail(r.id)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
                                         border-2 border-gray-100 text-gray-600 bg-white
                                         transition-all duration-300
                                         hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50
                                         hover:text-emerald-700 hover:shadow-md hover:scale-[1.02]"
                            >
                              Detail
                            </button>
                          </div>
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

      {/* Modal Detail */}
      <DetailModal open={open} onClose={() => setOpen(false)} data={detail} />
    </div>
  );
}

/* ============ Small UI ============ */
function ScoreChip({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const theme =
    v >= 80
      ? "from-emerald-600 to-teal-600"
      : v >= 60
      ? "from-amber-500 to-orange-600"
      : "from-rose-600 to-red-600";
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${theme}`}>
      {v}%
    </span>
  );
}
