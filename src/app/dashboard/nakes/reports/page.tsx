"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Search, Calendar, X, Activity, RotateCcw } from "lucide-react";
import { api } from "@/lib/api";

/* ============ Types ============ */
type Row = {
  id: string | number;
  userId?: string | number;
  name: string;
  date: string;          // ISO / string dari backend
  riskPct?: number;      // 0-100
};

type ScreeningDetail = {
  id?: string | number;
  created_at?: string;
  updated_at?: string;

  // tampilan header
  riskPct?: number;
  riskLabel?: string;

  // data pasien
  nama?: string;
  name?: string;
  usia?: string | number;
  jenis_kelamin?: string;
  gender?: string;

  bmi?: string | number;
  tekanan_darah?: string;
  sistolik?: number | string;
  diastolik?: number | string;

  riwayat_merokok?: string;
  smoker_status?: string;

  riwayat_jantung?: string;
  heart_history?: string;

  klasifikasi_hipertensi?: string;
  gula_darah?: string;
  blood_sugar?: string | number;
};

/* ============ Helpers ============ */
const TZ = "Asia/Jakarta";

/** Format waktu ke lokal Indonesia + Asia/Jakarta secara konsisten */
function formatIDTime(input?: string) {
  if (!input) return "-";
  let s = String(input).trim();

  // contoh input: "2025-10-09 23:13:00" (tanpa offset)
  const hasOffset = /[+-]\d{2}:\d{2}$/.test(s);
  const hasZ = /Z$/.test(s);
  const isoish = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(s);

  // normalize ke ISO valid. Jika backend tidak sertakan offset, treat as UTC.
  if (isoish && !hasOffset && !hasZ) {
    s = s.replace(" ", "T") + "Z";
  }

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

const greenGrad = "from-emerald-500 to-teal-500";

function first<T = any>(obj: any, keys: string[], fallback?: any): T | any {
  for (const k of keys) {
    const v = k.includes(".")
      ? k.split(".").reduce((acc: any, key) => (acc ? acc[key] : undefined), obj)
      : obj?.[k];
    if (v !== undefined && v !== null) return v;
  }
  return fallback;
}
function toNumber(x: any): number | undefined {
  const n = Number(String(x).replace("%", ""));
  return Number.isFinite(n) ? n : undefined;
}
function coerceArray(root: any): any[] {
  if (!root) return [];
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.data)) return root.data;
  if (Array.isArray(root?.items)) return root.items;
  if (Array.isArray(root?.results)) return root.results;
  if (Array.isArray(root?.rows)) return root.rows;
  return [];
}
function mapRow(x: any): Row {
  const id =
    x.id ?? x.screening_id ?? x.result_id ?? x._id ?? crypto.randomUUID();
  const name =
    first(x, ["user.nama", "user.name"]) ??
    first(x, ["nama", "name", "patient_name"], "Tanpa Nama");
  // urutan tanggal yang benar (jangan default ke now)
  const date =
    first(x, ["screened_at", "created_at", "date", "submitted_at"]) ?? "";
  const risk =
    toNumber(first(x, ["riskPct", "risk_percentage", "risk_percent"])) ??
    toNumber(first(x, ["percentage", "score", "diabetes_probability"])) ??
    undefined;

  const userId = first(x, ["userId", "user_id", "user.id"]);

  return { id, name, date, riskPct: risk, userId };
}

function mapDetail(root: any): ScreeningDetail {
  const x = root?.data ?? root ?? {};
  const riskPct =
    toNumber(first(x, ["riskPct", "risk_percentage", "risk_percent"])) ??
    toNumber(first(x, ["percentage", "score", "diabetes_probability"]));
  const riskLabel =
    first(x, ["riskLabel", "status_risiko", "status"]) ??
    (typeof riskPct === "number" ? (riskPct >= 60 ? "Risiko Tinggi" : "Risiko Rendah") : "Status Risiko");

  // tekanan darah
  const sys = first(x, ["sistolik", "systolic", "systolic_bp", "blood_pressure_systolic"]);
  const dia = first(x, ["diastolik", "diastolic", "diastolic_bp", "blood_pressure_diastolic"]);
  const tekanan =
    first(x, ["tekanan_darah"]) ??
    (sys || dia ? `${sys ?? "-"} / ${dia ?? "-"}` : undefined);

  // gula darah
  const gula =
    first(x, ["gula_darah"]) ??
    (x.blood_glucose_level || x.blood_sugar ? `${x.blood_glucose_level ?? x.blood_sugar} mg/dL` : undefined);

  // klasifikasi HT fallback kalau backend belum kirim
  const klasHT =
    first(x, ["klasifikasi_hipertensi", "htn_class"]) ??
    classifyHypertension(toNumber(sys), toNumber(dia));

  return {
    id: first(x, ["id", "screening_id", "result_id"]),
    created_at: first(x, ["created_at", "screened_at"]),
    updated_at: first(x, ["updated_at"]),

    riskPct,
    riskLabel,

    nama:
      first(x, ["user.nama"]) ??
      first(x, ["nama", "name", "patient_name", "user.name"]),
    usia: first(x, ["usia", "age"]),
    jenis_kelamin: first(x, ["jenis_kelamin", "gender"]),
    gender: first(x, ["gender"]),

    bmi: first(x, ["bmi"]),
    tekanan_darah: tekanan,
    sistolik: sys,
    diastolik: dia,

    riwayat_merokok: first(x, ["riwayat_merokok", "smoking_history", "smoker_status"]),
    smoker_status: first(x, ["smoker_status"]),

    riwayat_jantung: first(x, ["riwayat_jantung", "heart_disease", "heart_history"]),
    heart_history: first(x, ["heart_history"]),

    klasifikasi_hipertensi: klasHT,
    gula_darah: gula,
    blood_sugar: first(x, ["blood_glucose_level", "blood_sugar"]),
  };
}

function classifyHypertension(s?: number, d?: number): string | undefined {
  if (s == null && d == null) return undefined;
  if ((s ?? 0) >= 180 || (d ?? 0) >= 120) return "Krisis Hipertensi";
  if ((s ?? 0) >= 140 || (d ?? 0) >= 90) return "Hipertensi Derajat 2";
  if ((s ?? 0) >= 130 || (d ?? 0) >= 80) return "Hipertensi Derajat 1";
  if ((s ?? 0) >= 120 && (d ?? 0) < 80) return "Prahipertensi / Ditinggikan";
  return "Normal";
}

/* ====== Endpoint list ====== */
const LIST_PATH = "/nakes/diabetes-screenings";

/* ============ Modal gabungan (Detail + Riwayat) ============ */
function DetailModal({
  open,
  onClose,
  detail,
  history,
}: {
  open: boolean;
  onClose: () => void;
  detail?: ScreeningDetail | null;
  history: Row[];
}) {
  const [showHistory, setShowHistory] = useState(false);
  if (!open) return null;

  const d = detail ?? {};
  const pct = d.riskPct ?? 0;
  const tone =
    pct >= 60
      ? "border-amber-300 bg-amber-50 text-amber-900"
      : "border-emerald-300 bg-emerald-50 text-emerald-900";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-5xl mx-4 rounded-2xl bg-white border-2 border-gray-100 shadow-2xl">
        {/* lock tinggi modal supaya tidak “membengkak”, konten di-scroll */}
        <div className="max-h-[85vh] overflow-y-auto">
          {/* header */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 grid place-items-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-gray-900">Detail Screening</p>
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
            {/* status risiko */}
            <div className={`rounded-xl border ${tone} px-4 py-3`}>
              <p className="font-semibold">
                {d.riskLabel ?? "Status Risiko"}{" "}
                <span className="opacity-70">({Math.round(pct)}%)</span>
              </p>
              <p className="text-sm opacity-70">Berdasarkan screening terbaru</p>
            </div>

            {/* grid data */}
            <div className="rounded-2xl border-2 border-gray-100 bg-white">
              <div className="px-5 py-4 border-b">
                <p className="text-sm font-semibold text-gray-700">
                  Data Screening Terbaru
                </p>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Nama Pasien", value: d.nama ?? d.name ?? "-" },
                  { label: "Usia", value: d.usia ? `${d.usia} tahun` : "-" },
                  { label: "Jenis Kelamin", value: d.jenis_kelamin ?? d.gender ?? "-" },
                  { label: "BMI", value: d.bmi ?? "-" },
                  {
                    label: "Tekanan Darah",
                    value:
                      d.tekanan_darah ??
                      (d.sistolik || d.diastolik
                        ? `${d.sistolik ?? "-"} / ${d.diastolik ?? "-"}`
                        : "-"),
                  },
                  { label: "Klasifikasi Hipertensi", value: d.klasifikasi_hipertensi ?? "-" },
                  { label: "Riwayat Merokok", value: d.riwayat_merokok ?? d.smoker_status ?? "-" },
                  { label: "Riwayat Jantung", value: d.riwayat_jantung ?? "-" },
                  { label: "Gula Darah", value: d.gula_darah ?? d.blood_sugar ?? "-" },
                ].map((it, i) => (
                  <div
                    key={i}
                    className="rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                      {it.label}
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {it.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Riwayat (collapsible) */}
            <div className="rounded-2xl border-2 border-gray-100 bg-white">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  Riwayat Screening
                </p>
                <button
                  type="button"
                  onClick={() => setShowHistory((v) => !v)}
                  className="px-4 py-2 rounded-xl font-semibold
                             border-2 border-gray-100 text-gray-600 bg-white
                             transition-all duration-300
                             hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50
                             hover:text-emerald-700 hover:shadow-md hover:scale-[1.02]"
                  aria-expanded={showHistory}
                  aria-controls="riwayat-panel"
                >
                  {showHistory ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>

              {/* wrapper supaya tinggi card TETAP, list-nya yang scroll */}
              <div
                id="riwayat-panel"
                className={`transition-[max-height] duration-200 ease-in-out overflow-hidden ${
                  showHistory ? "max-h-[45vh]" : "max-h-0"
                }`}
              >
                <div className="p-4 max-h-[45vh] overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">
                      Belum ada riwayat.
                    </p>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {history.map((r, i) => (
                        <li
                          key={`${r.id}-${i}`}
                          className="flex items-center justify-between py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 grid place-items-center font-semibold">
                              {i + 1}
                            </span>
                            <div className="text-sm">
                              <p className="font-semibold text-gray-900">
                                {formatIDTime(r.date)}
                              </p>
                              <p className="text-xs text-gray-500">{r.name}</p>
                            </div>
                          </div>
                          <RiskChip value={r.riskPct} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            {/* end riwayat */}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ Page ============ */
export default function LaporanKeseluruhan() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // modal gabungan
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<ScreeningDetail | null>(null);
  const [historyItems, setHistoryItems] = useState<Row[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  async function fetchList() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get(LIST_PATH);
      const arr = coerceArray(res?.data ?? res);
      const mapped: Row[] = arr.map(mapRow);

      // gabung per user: ambil entri terbaru tiap user
      const byUser = new Map<string | number, Row>();
      for (const r of mapped) {
        const key = r.userId ?? r.name; // fallback ke nama kalau userId kosong
        const prev = byUser.get(key as any);
        if (!prev) {
          byUser.set(key as any, r);
        } else {
          const prevTime = prev.date ? Date.parse(prev.date) : 0;
          const currTime = r.date ? Date.parse(r.date) : 0;
          if (currTime > prevTime) byUser.set(key as any, r);
        }
      }
      setRows(Array.from(byUser.values()).sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message || "Gagal memuat riwayat screening.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // load sekali (tanpa auto refresh)
    fetchList();
  }, []);

  async function openDetail(userId?: string | number, fallbackName?: string) {
    if (!userId && !fallbackName) return;
    setOpen(true);
    setDetail(null);
    setHistoryItems([]);
    setDetailLoading(true);
    try {
      // 1) ambil seluruh riwayat user
      const { data } = await api.get(`/nakes/users/${userId}/diabetes-screenings`);
      const items: Row[] = coerceArray(data)
        .map(mapRow)
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
      setHistoryItems(items);

      // 2) ambil detail screening TERBARU
      if (items[0]) {
        const det = await api.get(`/nakes/diabetes-screenings/${items[0].id}`);
        setDetail(mapDetail(det.data));
      } else {
        setDetail({ nama: fallbackName, riskLabel: "Detail tidak ditemukan", riskPct: 0 });
      }
    } catch (e) {
      console.error(e);
      setDetail({ nama: fallbackName, riskLabel: "Detail tidak ditemukan", riskPct: 0 });
    } finally {
      setDetailLoading(false);
    }
  }

  const q = search.trim().toLowerCase();
  const filtered = useMemo(
    () => (q ? rows.filter((r) => r.name?.toLowerCase().includes(q)) : rows),
    [q, rows]
  );

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${greenGrad} flex items-center justify-center shadow-xl`}>
            <FileText className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Laporan Keseluruhan</h1>
            <p className="text-gray-600 mt-0.5">Riwayat Screening Pasien</p>
          </div>

          {/* tombol refresh */}
          <button
            onClick={fetchList}
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

        {/* Table Card */}
        <Card className="rounded-3xl border-2 border-gray-100 shadow-2xl">
          <CardContent className="p-0">
            {/* Toolbar */}
            <div className="p-5 md:p-6 border-b-2 border-gray-100 flex flex-col md:flex-row gap-4 md:items-center">
              {/* Search left */}
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama…"
                  className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {/* Total Screening (jumlah user unik yang tampil) */}
              <div className="md:ml-auto">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-100 bg-white/80 backdrop-blur shadow-sm">
                  <span className="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">Total Screening</span>
                  <span className="text-sm font-bold text-gray-900">{rows.length}</span>
                </div>
                <div className="sm:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white">
                  <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-900">{rows.length}</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {["No", "Nama", "Tanggal Terbaru", "Risiko", "Aksi"].map((h, i) => (
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
                      <td colSpan={5} className="py-16 text-center text-gray-500">
                        Memuat…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-gray-500">
                        Tidak ada data.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r, i) => (
                      <tr
                        key={`${r.userId ?? r.id}`}
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
                          <RiskChip value={r.riskPct} />
                        </td>
                        <td className="py-4 pr-6">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => openDetail(r.userId, r.name)}
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

      {/* Modal gabungan */}
      <DetailModal open={open} onClose={() => setOpen(false)} detail={detail} history={historyItems} />
    </div>
  );
}

/* ============ Small UI ============ */
function RiskChip({ value }: { value?: number }) {
  const pct = value ?? 0;
  const theme = pct >= 60 ? "from-amber-500 to-orange-600" : "from-emerald-600 to-teal-600";
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${theme}`}>
      {Math.round(pct)}%
    </span>
  );
}
