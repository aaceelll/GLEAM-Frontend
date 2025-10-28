"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Search, Calendar, X, Activity, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";
import ScreeningLineChart from "@/components/ScreeningLineChart";

/* ============ Types ============ */
type Row = {
  id: string | number;
  userId?: string | number;
  name: string;
  date: string;
  riskPct?: number;
  riskText?: string;
  systolic_bp?: string | number;
  diastolic_bp?: string | number;
  bmi?: string | number;
  blood_glucose_level?: string | number;
};

type ScreeningDetail = {
  id?: string | number;
  created_at?: string;
  updated_at?: string;
  riskPct?: number;
  riskText?: string;
  riskLabel?: string;
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

function formatIDTime(input?: string) {
  if (!input) return "-";
  let s = String(input).trim();
  const hasOffset = /[+-]\d{2}:\d{2}$/.test(s);
  const hasZ = /Z$/.test(s);
  const isoish = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(s);

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
  if (x === undefined || x === null) return undefined;
  const n = Number(String(x).replace("%", "").trim());
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

function pickRiskText(x: any): string | undefined {
  const raw =
    first(x, ["riskText", "diabetes_result", "result", "diabetes_probability"]) ??
    first(x, ["percentage", "score"]);
  if (!raw) return undefined;
  const s = String(raw).trim();
  if (!s) return undefined;
  if (s.includes("%")) return s;
  const n = toNumber(s);
  return typeof n === "number" ? `${n.toFixed(2)}%` : s;
}

/* ⬇️ baru: untuk memastikan nilai ke number 0–100 */
function parsePctFromMaybeText(x: any): number | undefined {
  if (x == null) return undefined;
  if (typeof x === "number" && Number.isFinite(x)) return x;
  const s = String(x).trim();
  const n = Number(s.replace("%", "").trim());
  return Number.isFinite(n) ? n : undefined;
}

/** ✅ KMK No. HK.01.07/MENKES/4334/2021 — dipakai seragam di semua UI */
function classifyHT_Kemenkes(sysRaw: any, diaRaw: any): string {
  const s = toNumber(sysRaw);
  const d = toNumber(diaRaw);
  if (s == null || d == null) return "-";

  if (s < 120 && d < 80) {
    return "Optimal";
  } else if ((s >= 120 && s <= 129) || (d >= 80 && d <= 84)) {
    return "Normal";
  } else if ((s >= 130 && s <= 139) || (d >= 85 && d <= 89)) {
    return "Normal Tinggi (Pra Hipertensi)";
  } else if (s >= 180 || d >= 110) {
    return "Hipertensi Derajat 3";
  } else if ((s >= 160 && s <= 179) || (d >= 100 && d <= 109)) {
    return "Hipertensi Derajat 2";
  } else if (s >= 140 && d < 90) {
    return "Hipertensi Sistolik Terisolasi";
  } else if ((s >= 140 && s <= 159) || (d >= 90 && d <= 99)) {
    return "Hipertensi Derajat 1";
  } else {
    return "Tidak dapat diklasifikasikan";
  }
}

/* ============ Mapping ============ */
function mapRow(x: any): Row {
  const id = first(x, ["id", "screening_id", "result_id", "_id"]) ?? crypto.randomUUID();
  const name =
    first(x, ["user.nama", "user.name"]) ??
    first(x, ["nama", "name", "patient_name"], "Tanpa Nama");
  const date = first(x, ["screened_at", "created_at", "date", "submitted_at"]) ?? "";

  const riskNum =
    toNumber(first(x, ["riskPct", "risk_percentage", "risk_percent"])) ??
    toNumber(first(x, ["percentage", "score", "diabetes_probability"])) ??
    undefined;

  const riskText = pickRiskText(x);
  const userId = first(x, ["userId", "user_id", "user.id"]);

  // ⬇️ vital signs
  const systolic =
    first(x, ["systolic_bp", "blood_pressure_systolic", "sistolik", "systolic"]);
  const diastolic =
    first(x, ["diastolic_bp", "blood_pressure_diastolic", "diastolik", "diastolic"]);
  const bmi = first(x, ["bmi", "body_mass_index", "user.bmi"]);
  const glucose =
    first(x, ["blood_glucose_level", "blood_sugar", "gula_darah", "glucose"]);

  return {
    id,
    name,
    date,
    riskPct: riskNum,
    riskText,
    userId,
    systolic_bp: systolic,
    diastolic_bp: diastolic,
    bmi,
    blood_glucose_level: glucose,
  };
}

function mapDetail(root: any): ScreeningDetail {
  const x = root?.data ?? root ?? {};
  
  // 🔍 DEBUG: Log semua data mentah
  console.log("🔍 DEBUG mapDetail - Full raw data:", JSON.stringify(x, null, 2));
  console.log("🔍 DEBUG - All keys in data:", Object.keys(x));

  const riskPct =
    toNumber(first(x, ["riskPct", "risk_percentage", "risk_percent"])) ??
    toNumber(first(x, ["percentage", "score", "diabetes_probability"]));
  const riskText = pickRiskText(x);
  const riskLabel =
    first(x, ["riskLabel", "status_risiko", "status"]) ??
    (typeof riskPct === "number"
      ? riskPct >= 48
        ? "Risiko Tinggi"
        : riskPct <= 40
        ? "Risiko Rendah"
        : "Risiko Sedang"
      : "Status Risiko");

  // --- Ambil & normalisasi tekanan darah ---
  const sysRaw0 = first(x, ["sistolik", "systolic", "systolic_bp", "blood_pressure_systolic"]);
  const diaRaw0 = first(x, ["diastolik", "diastolic", "diastolic_bp", "blood_pressure_diastolic"]);
  const tekananStr = first(x, ["tekanan_darah"]) as string | undefined;

  console.log("🔍 DEBUG - Blood Pressure raw:", { sysRaw0, diaRaw0, tekananStr });

  let sys = toNumber(sysRaw0);
  let dia = toNumber(diaRaw0);

  if ((sys == null || dia == null) && typeof tekananStr === "string") {
    const m = tekananStr.match(/(\d+)\s*[/\-]\s*(\d+)/);
    if (m) {
      sys = toNumber(m[1]);
      dia = toNumber(m[2]);
    }
  }

  const tekanan =
    tekananStr ?? (sys != null || dia != null ? `${sys ?? "-"} / ${dia ?? "-"}` : undefined);

  const klasFromBp = classifyHT_Kemenkes(sys, dia);
  const klasHT =
    klasFromBp !== "-"
      ? klasFromBp
      : first(x, ["bp_classification", "klasifikasi_hipertensi", "htn_class"]) ?? "-";

  const bmiVal = first(x, ["bmi", "body_mass_index", "user.bmi"]);
  console.log("🔍 DEBUG - BMI:", { 
    direct_bmi: x.bmi, 
    body_mass_index: x.body_mass_index,
    user_bmi: x.user?.bmi,
    final_bmiVal: bmiVal 
  });

  const bloodSugarRaw = first(x, ["blood_glucose_level", "blood_sugar", "gula_darah", "glucose"]);
  const gula = bloodSugarRaw 
    ? (typeof bloodSugarRaw === 'string' && bloodSugarRaw.includes('mg/dL'))
      ? bloodSugarRaw
      : `${bloodSugarRaw} mg/dL`
    : undefined;
  
  console.log("🔍 DEBUG - Blood Sugar:", { 
    blood_glucose_level: x.blood_glucose_level,
    blood_sugar: x.blood_sugar,
    gula_darah: x.gula_darah,
    glucose: x.glucose,
    bloodSugarRaw,
    final_gula: gula 
  });

  const finalResult = {
    id: first(x, ["id", "screening_id", "result_id"]),
    created_at: first(x, ["created_at", "screened_at"]),
    updated_at: first(x, ["updated_at"]),
    riskPct,
    riskText,
    riskLabel,

    nama: first(x, ["user.nama"]) ?? first(x, ["nama", "name", "patient_name", "user.name"]),
    usia: first(x, ["usia", "age"]),
    jenis_kelamin: first(x, ["jenis_kelamin", "gender"]),
    gender: first(x, ["gender"]),
    bmi: bmiVal,

    tekanan_darah: tekanan,
    sistolik: sys ?? sysRaw0,
    diastolik: dia ?? diaRaw0,

    riwayat_merokok: first(x, ["riwayat_merokok", "smoking_history", "smoker_status"]),
    smoker_status: first(x, ["smoker_status"]),
    riwayat_jantung: first(x, ["riwayat_jantung", "heart_disease", "heart_history"]),
    heart_history: first(x, ["heart_history"]),

    klasifikasi_hipertensi: klasHT,

    gula_darah: gula,
    blood_sugar: bloodSugarRaw,
  };

  console.log("✅ DEBUG - Final mapped result:", finalResult);
  return finalResult;
}

const LIST_PATH = "/nakes/diabetes-screenings";

/* ============ ⬇️ baru: enrich riwayat dengan detail ============ */
async function enrichHistoryWithDetail(items: Row[]): Promise<Row[]> {
  const enriched = await Promise.all(items.map(async (r) => {
    try {
      const { data } = await api.get(`/nakes/diabetes-screenings/${r.id}`);
      const det = mapDetail(data);
      return {
        ...r,
        systolic_bp: det.sistolik ?? r.systolic_bp,
        diastolic_bp: det.diastolik ?? r.diastolic_bp,
        bmi: det.bmi ?? r.bmi,
        blood_glucose_level: det.blood_sugar ?? det.gula_darah ?? r.blood_glucose_level,
      };
    } catch {
      return r;
    }
  }));
  return enriched;
}

/* ============ Small UI Components ============ */
function RiskChip({ value, text }: { value?: number; text?: string }) {
  const pct = value ?? 0;
  const label =
    text ?? (Number.isFinite(pct) ? (Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(2)}%`) : "-");
  const theme =
    pct >= 48 ? "from-red-600 to-rose-600"
    : pct <= 40 ? "from-emerald-600 to-teal-600"
    : "from-amber-500 to-orange-600";

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${theme}`}>
      {label}
    </span>
  );
}

function DataCardNoIcon({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 p-4 hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-base font-bold text-gray-900 truncate">{value || "-"}</p>
      </div>
    </div>
  );
}

/* ============ Modal Popup: Detail item riwayat yang diklik ============ */
function HistoryDetailPopup({
  open,
  onClose,
  detail,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  detail: ScreeningDetail | null;
  loading: boolean;
}) {
  if (!open) return null;

  const d = detail ?? {};
  const pctNum = d.riskPct ?? 0;
  const pctText = d.riskText ?? (Number.isFinite(pctNum) ? `${pctNum}%` : "-");

  const labelByPct = Number.isFinite(pctNum)
    ? pctNum >= 48
      ? "Risiko Tinggi"
      : pctNum <= 40
      ? "Risiko Rendah"
      : "Risiko Sedang"
    : d.riskLabel ?? "Status Risiko";

  const tone =
    pctNum >= 48
      ? "border-red-200 bg-red-50 text-red-900"
      : pctNum <= 40
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-amber-200 bg-amber-50 text-amber-900";

  const sysN = toNumber(d.sistolik);
  const diaN = toNumber(d.diastolik);
  const klasUI = classifyHT_Kemenkes(sysN, diaN);
  const klasFinal = klasUI !== "-" ? klasUI : d.klasifikasi_hipertensi ?? "-";
  const tekananUI = d.tekanan_darah ?? (sysN != null || diaN != null ? `${sysN ?? "-"} / ${diaN ?? "-"}` : "-");

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] flex flex-col">
        <div className="relative px-6 py-5 bg-emerald-600 overflow-hidden">
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Detail Screening</h2>
              <p className="text-sm text-white/90">{d.nama || "Pasien"}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all flex items-center justify-center group"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Memuat detail screening...</p>
              </div>
            </div>
          ) : (
            <>
              <div className={`rounded-2xl border-2 p-4 ${tone} shadow-lg`}>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold opacity-70 mb-1">STATUS RISIKO DIABETES</p>
                    <p className="text-xl font-bold">{labelByPct}</p>
                    <p className="text-lg font-semibold mt-1">{pctText}</p>
                    <p className="text-xs opacity-75 mt-1">
                      Tanggal: {d.created_at ? formatIDTime(d.created_at) : "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DataCardNoIcon label="Nama Pasien" value={d.nama} />
                <DataCardNoIcon label="Usia" value={d.usia ? `${d.usia} tahun` : "-"} />
                <DataCardNoIcon label="Jenis Kelamin" value={d.jenis_kelamin || d.gender} />
                <DataCardNoIcon label="BMI" value={d.bmi} />
                <DataCardNoIcon label="Tekanan Darah" value={tekananUI} />
                <DataCardNoIcon label="Klasifikasi HT" value={klasFinal} />
                <DataCardNoIcon label="Gula Darah" value={d.gula_darah} />
                <DataCardNoIcon label="Riwayat Merokok" value={d.riwayat_merokok || d.smoker_status} />
                <DataCardNoIcon label="Riwayat Jantung" value={d.riwayat_jantung || d.heart_history} />
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ Modal Gabungan (Detail terbaru + Riwayat) ============ */
function DetailModal({
  open,
  onClose,
  detail,
  history,
  onHistoryItemClick,
}: {
  open: boolean;
  onClose: () => void;
  detail?: ScreeningDetail | null;
  history: Row[];
  onHistoryItemClick: (id: string | number) => void;
}) {
  const [showHistory, setShowHistory] = useState(false);
  if (!open) return null;

  const d = detail ?? {};
  const pctNum = d.riskPct ?? 0;
  const pctText = d.riskText ?? (Number.isFinite(pctNum) ? `${pctNum}%` : "-");

  const labelByPct = Number.isFinite(pctNum)
    ? pctNum >= 48
      ? "Risiko Tinggi"
      : pctNum <= 40
      ? "Risiko Rendah"
      : "Risiko Sedang"
    : d.riskLabel ?? "Status Risiko";

  const tone =
    pctNum >= 48
      ? "border-red-200 bg-red-50 text-red-900"
      : pctNum <= 40
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-amber-200 bg-amber-50 text-amber-900";

  const sysN = toNumber(d.sistolik);
  const diaN = toNumber(d.diastolik);
  const klasUI = classifyHT_Kemenkes(sysN, diaN);
  const klasFinal = klasUI !== "-" ? klasUI : d.klasifikasi_hipertensi ?? "-";
  const tekananUI = d.tekanan_darah ?? (sysN != null || diaN != null ? `${sysN ?? "-"} / ${diaN ?? "-"}` : "-");

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-5xl mx-4 rounded-2xl bg-white border-2 border-gray-100 shadow-2xl overflow-hidden">
        <div className="max-h-[85vh] flex flex-col">
          {/* Header - Sticky */}
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-4 border-b bg-white shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 grid place-items-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-gray-900">Detail Screening</p>
            </div>
            <button
              aria-label="Tutup"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Grafik riwayat */}
            {history.length > 0 && (
              <div className="mb-6">
                <ScreeningLineChart
                  data={history.map((h) => {
                    const pct =
                      parsePctFromMaybeText(h.riskPct) ??
                      parsePctFromMaybeText(h.riskText) ?? 0;

                    return {
                      id: h.id,
                      created_at: h.date,
                      diabetes_probability: pct, // number 0–100
                      patient_name: h.name,

                      // tooltip fields (jangan undefined)
                      age: "" as string | number,
                      gender: "",
                      systolic_bp: (h.systolic_bp ?? "-") as string | number,
                      diastolic_bp: (h.diastolic_bp ?? "-") as string | number,
                      heart_disease: "",
                      smoking_history: "",
                      bmi: (h.bmi ?? "-") as string | number,
                      blood_glucose_level: (h.blood_glucose_level ?? "-") as string | number,
                      diabetes_result: "",
                      bp_classification: "",
                      bp_recommendation: "",
                    };
                  })}
                  height={280}
                />
              </div>
            )}

            {/* Status Risiko */}
            <div className={`rounded-xl border px-4 py-3 ${tone}`}>
              <p className="font-semibold">
                {labelByPct} <span className="opacity-90">({pctText})</span>
              </p>
              <p className="text-sm opacity-70">Berdasarkan screening terbaru</p>
            </div>

            {/* Grid Data Screening Terbaru */}
            <div className="rounded-2xl border-2 border-gray-100 bg-white">
              <div className="px-5 py-4 border-b">
                <p className="text-sm font-semibold text-gray-700">Data Screening Terbaru</p>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Nama Pasien", value: d.nama ?? d.name ?? "-" },
                  { label: "Usia", value: d.usia ? `${d.usia} tahun` : "-" },
                  { label: "Jenis Kelamin", value: d.jenis_kelamin ?? d.gender ?? "-" },
                  { label: "BMI", value: d.bmi ?? "-" },
                  { label: "Tekanan Darah", value: tekananUI },
                  { label: "Klasifikasi HT", value: klasFinal },
                  { label: "Gula Darah", value: d.gula_darah ?? (d.blood_sugar ? `${d.blood_sugar} mg/dL` : "-") },
                  { label: "Riwayat Merokok", value: d.riwayat_merokok ?? d.smoker_status ?? "-" },
                  { label: "Riwayat Jantung", value: d.riwayat_jantung ?? d.heart_history ?? "-" },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Riwayat Screening */}
            <div className="rounded-2xl border-2 border-gray-100 bg-white">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Riwayat Screening</p>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showHistory ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>

              <div
                id="riwayat-panel"
                className={`transition-[max-height] duration-200 ease-in-out overflow-hidden ${
                  showHistory ? "max-h-[45vh]" : "max-h-0"
                }`}
              >
                <div className="p-4 max-h-[45vh] overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">Belum ada riwayat.</p>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {history.map((r, i) => (
                        <li
                          key={`${r.id}-${i}`}
                          onClick={() => onHistoryItemClick(r.id)}
                          className="flex items-center justify-between py-3 cursor-pointer hover:bg-emerald-50 rounded-lg px-2 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 grid place-items-center font-semibold">
                              {i + 1}
                            </span>
                            <div className="text-sm">
                              <p className="font-semibold text-gray-900">{formatIDTime(r.date)}</p>
                              <p className="text-xs text-gray-500">{r.name}</p>
                            </div>
                          </div>
                          <RiskChip value={r.riskPct} text={r.riskText} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}

/* ============ Page Component ============ */
export default function LaporanKeseluruhan() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal gabungan
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<ScreeningDetail | null>(null);
  const [historyItems, setHistoryItems] = useState<Row[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal secondary untuk riwayat-item
  const [selectedHistoryDetail, setSelectedHistoryDetail] = useState<ScreeningDetail | null>(null);
  const [showHistoryDetailPopup, setShowHistoryDetailPopup] = useState(false);
  const [loadingHistoryDetail, setLoadingHistoryDetail] = useState(false);

  async function fetchList() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get(LIST_PATH);
      const arr = coerceArray(res?.data ?? res);
      const mapped: Row[] = arr.map(mapRow);

      const byUser = new Map<string | number, Row>();
      for (const r of mapped) {
        const key = r.userId ?? r.name;
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
    fetchList();
  }, []);

  async function openDetail(userId?: string | number, fallbackName?: string) {
    if (!userId && !fallbackName) return;
    setOpen(true);
    setDetail(null);
    setHistoryItems([]);
    setDetailLoading(true);
    try {
      const { data } = await api.get(`/nakes/users/${userId}/diabetes-screenings`);
      const items: Row[] = coerceArray(data)
        .map(mapRow)
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

      /* ⬇️ penting: enrich riwayat supaya ada BP/BMI/Gula */
      const enriched = await enrichHistoryWithDetail(items);
      setHistoryItems(enriched);

      if (enriched[0]) {
        const det = await api.get(`/nakes/diabetes-screenings/${enriched[0].id}`);
        setDetail(mapDetail(det.data));
      } else {
        setDetail({ nama: fallbackName, riskLabel: "Detail tidak ditemukan", riskPct: 0, riskText: "0%" });
      }
    } catch (e) {
      console.error(e);
      setDetail({ nama: fallbackName, riskLabel: "Detail tidak ditemukan", riskPct: 0, riskText: "0%" });
    } finally {
      setDetailLoading(false);
    }
  }

  async function fetchSpecificScreeningDetail(screeningId: string | number) {
    setLoadingHistoryDetail(true);
    setShowHistoryDetailPopup(true);
    setSelectedHistoryDetail(null);

    try {
      const { data } = await api.get(`/nakes/diabetes-screenings/${screeningId}`);
      setSelectedHistoryDetail(mapDetail(data));
    } catch (e) {
      console.error(e);
      setSelectedHistoryDetail({
        nama: "Error",
        riskLabel: "Gagal memuat detail",
        riskPct: 0,
        riskText: "0%",
      });
    } finally {
      setLoadingHistoryDetail(false);
    }
  }

  const q = search.trim().toLowerCase();
  const filtered = useMemo(() => (q ? rows.filter((r) => r.name?.toLowerCase().includes(q)) : rows), [q, rows]);

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
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-[22px] leading-[1.15] sm:text-3xl md:text-4xl font-bold text-gray-800">
                Laporan Keseluruhan
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-0.5">Riwayat Screening Pasien</p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-800 px-4 py-3">
            {errorMsg}
          </div>
        )}

        {/* Table Card */}
        <Card className="rounded-3xl border-2 border-gray-100 shadow-2xl">
          <CardContent className="p-0">
            <div className="p-5 md:p-6 border-b-2 border-gray-100 flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama…"
                  className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

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

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="w-full border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-gray-50">
                    {["No", "Nama", "Tanggal Terbaru", "Risiko", "Aksi"].map((h, i) => (
                      <th
                        key={h}
                        className={[
                          "text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wide py-4 border-b-2 border-gray-100 whitespace-nowrap",
                          i === 0 ? "pl-4 sm:pl-6 w-16" : "",
                          i === 4 ? "pr-4 sm:pr-6 text-right" : "",
                          i === 1 ? "min-w-[120px]" : "",
                          i === 2 ? "min-w-[200px]" : "",
                          i === 3 ? "min-w-[100px]" : "",
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
                        <td className="pl-4 sm:pl-6 py-4 font-semibold text-gray-900 text-sm sm:text-base">{i + 1}</td>
                        <td className="py-4 font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap">{r.name}</td>
                        <td className="py-4 text-xs sm:text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="whitespace-nowrap">{formatIDTime(r.date)}</span>
                          </span>
                        </td>
                        <td className="py-4">
                          <RiskChip value={r.riskPct} text={r.riskText} />
                        </td>
                        <td className="py-4 pr-4 sm:pr-6">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => openDetail(r.userId, r.name)}
                              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm
                                         border-2 border-gray-100 text-gray-600 bg-white
                                         transition-all duration-300
                                         hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50
                                         hover:text-emerald-700 hover:shadow-md hover:scale-[1.02] whitespace-nowrap"
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

      {/* Modal Gabungan */}
      <DetailModal
        open={open}
        onClose={() => setOpen(false)}
        detail={detail}
        history={historyItems}
        onHistoryItemClick={fetchSpecificScreeningDetail}
      />

      {/* Modal Popup untuk item Riwayat yang diklik */}
      <HistoryDetailPopup
        open={showHistoryDetailPopup}
        onClose={() => setShowHistoryDetailPopup(false)}
        detail={selectedHistoryDetail}
        loading={loadingHistoryDetail}
      />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
}
