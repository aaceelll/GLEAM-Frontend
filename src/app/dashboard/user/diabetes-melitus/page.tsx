"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  FileText,
  Video,
  Calendar,
  Clock,
  ListChecks,
  ClipboardList,
  Play,
  Activity,
  ChevronDown,
  ChevronUp,
  Lock as LockIcon,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";
import ScreeningLineChart from "@/components/ScreeningLineChart"; // GRAFIK

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
  source?: "tests" | "banks";
  [key: string]: any;
};

type ScreeningResult = {
  id: number | string;
  patient_name: string;
  age: number | string;
  gender: string;
  systolic_bp: number | string;
  diastolic_bp: number | string;
  heart_disease: string;
  smoking_history: string;
  bmi: number | string;
  blood_glucose_level: number | string;
  diabetes_probability: string; // "48.03%"
  diabetes_result: string;      // teks backend – diabaikan kalau persen valid
  bp_classification: string;
  bp_recommendation: string;
  created_at: string;
};

/* ================= Utils ================= */
function normalizeKey(raw: string) {
  return (raw || "")
    .toLowerCase()
    .replace(/\b(pre|post)\b/g, "")
    .replace(/\b(test|kuis|quiz|kuisioner)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function detectType(name: string): "pre" | "post" | "unknown" {
  const n = (name || "").toLowerCase();
  if (/\bpost\b/.test(n)) return "post";
  if (/\bpre\b/.test(n)) return "pre";
  return "unknown";
}
function isCompletedLike(x: any) {
  if (!x) return false;
  if (x.done === true || x.is_done === true || x.completed === true) return true;
  if (typeof x.status === "string" && x.status.toLowerCase() === "finished") return true;
  if (typeof x.percentage === "number" && x.percentage >= 0) return true;
  return false;
}
function first<T = any>(obj: any, keys: string[], fallback?: any): T | any {
  for (const k of keys) {
    const v = k.includes(".")
      ? k.split(".").reduce((acc: any, key) => (acc ? acc[key] : undefined), obj)
      : obj?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return fallback;
}
function pct(v: any): string {
  if (v == null) return "-";
  if (typeof v === "string" && v.includes("%")) return v;
  const n = Number(v);
  return Number.isFinite(n) ? `${n.toFixed(2)}%` : String(v);
}
function mapScreening(x: any): ScreeningResult {
  const prob = first(x, [
    "diabetes_probability",
    "percentage",
    "score",
    "riskPct",
    "risk_percentage",
  ]);
  return {
    id:
      first(x, ["id", "screening_id", "_id"], typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Math.random())),
    patient_name:
      first(x, ["patient_name"]) ??
      first(x, ["nama", "name"]) ??
      first(x, ["user.nama", "user.name"], "-"),
    age: first(x, ["age", "usia"], "-"),
    gender: first(x, ["gender", "jenis_kelamin"], "-"),
    systolic_bp: first(x, ["systolic_bp", "sistolik", "blood_pressure_systolic"], "-"),
    diastolic_bp: first(x, ["diastolic_bp", "diastolik", "blood_pressure_diastolic"], "-"),
    heart_disease: first(x, ["heart_disease", "riwayat_jantung"], "-"),
    smoking_history: first(x, ["smoking_history", "riwayat_merokok"], "-"),
    bmi: first(x, ["bmi"], "-"),
    blood_glucose_level: first(x, ["blood_glucose_level", "blood_sugar", "gula_darah"], "-"),
    diabetes_probability: pct(prob),
    diabetes_result: first(x, ["diabetes_result", "riskLabel", "status"], ""),
    bp_classification: first(
      x,
      [
        "bp_classification",
        "klasifikasi_hipertensi",
        "hypertension_classification",
        "hypertension_stage",
        "hypertension_stage_name",
        "hipertensi_derajat",
        "stage",
        "classification",
      ],
      "-"
    ),
    bp_recommendation: first(x, ["bp_recommendation", "rekomendasi", "recommendation"], ""),
    created_at:
      first(x, ["created_at", "screened_at", "submitted_at"]) ?? new Date().toISOString(),
  };
}

/* ===== Risk helpers – SAMAA dengan NAKES ===== */
function parseProb(p: string | number): number {
  if (typeof p === "number") return p;
  if (!p) return NaN;
  const cleaned = String(p).replace("%", "").replace(",", ".").trim();
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
}
function computeRisk(probStr: string | number, resultText?: string) {
  const prob = parseProb(probStr);
  let level: "low" | "mid" | "high";
  if (Number.isFinite(prob)) {
    if (prob >= 63) level = "high";
    else if (prob >= 48) level = "mid";
    else level = "low";
  } else {
    const t = (resultText || "").toLowerCase();
    if (t.includes("tinggi")) level = "high";
    else if (t.includes("sedang")) level = "mid";
    else level = "low";
  }
  const label =
    level === "high" ? "Risiko Tinggi" : level === "mid" ? "Risiko Sedang" : "Risiko Rendah";

  const theme =
    level === "high"
      ? {
          bg: "from-red-50 to-rose-50",
          border: "border-red-200",
          accentText: "text-red-700",
          badge: "bg-red-100 text-red-800",
        }
      : level === "mid"
      ? {
          bg: "from-amber-50 to-orange-50",
          border: "border-amber-200",
          accentText: "text-amber-700",
          badge: "bg-amber-100 text-amber-800",
        }
      : {
          bg: "from-emerald-50 to-green-50",
          border: "border-emerald-200",
          accentText: "text-emerald-700",
          badge: "bg-emerald-100 text-emerald-800",
        };

  const badgeClass =
    level === "high"
      ? "bg-red-100 text-red-800"
      : level === "mid"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-800";

  return { prob, level, label, theme, badgeClass };
}

/* ============== Page ============== */
export default function DiabetesMelitusPage() {
  const router = useRouter();

  const [konten, setKonten] = useState<MateriItem[]>([]);
  const [tes, setTes] = useState<TesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [preDoneMap, setPreDoneMap] = useState<Record<string, boolean>>({});

  const [latestResult, setLatestResult] = useState<ScreeningResult | null>(null);
  const [historyResults, setHistoryResults] = useState<ScreeningResult[]>([]);
  const [loadingScreening, setLoadingScreening] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  /* Pre progress */
  useEffect(() => {
    (async () => {
      try {
        const tries = ["/quiz/history?type=pre", "/quiz/history?tipe=pre", "/quiz/history"];
        let arr: any[] = [];
        for (const url of tries) {
          try {
            const r = await api.get(url);
            const raw = r?.data?.data ?? r?.data ?? [];
            arr = Array.isArray(raw) ? raw : [];
            if (arr.length || url !== "/quiz/history") break;
          } catch {}
        }
        const preOnly = arr.filter((x) => {
          const t = String(first(x, ["tipe", "type", "quiz_type"], "")).toLowerCase();
          return t === "pre" || /(^|[^a-z])pre([^a-z]|$)/.test(t);
        });
        const done: Record<string, boolean> = {};
        for (const x of preOnly) {
          const rawName =
            first(x, ["nama", "name", "title"]) ?? first(x, ["bank.nama", "bank.name"]) ?? "";
          const base = normalizeKey(String(rawName));
          if (!base) continue;
          if (
            isCompletedLike(x) ||
            first(x, ["percentage", "score", "persentase"]) != null ||
            first(x, ["total_score"]) != null
          ) {
            done[base] = true;
          }
        }
        Object.keys(localStorage).forEach((k) => {
          const m = k.match(/^quiz_done_pre_(.+)$/);
          if (m && localStorage.getItem(k) === "true") done[m[1]] = true;
        });
        setPreDoneMap(done);
      } catch {
        setPreDoneMap({});
      }
    })();
  }, []);

  /* Materi + tes */
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await api.get("/materi/konten", { params: { slug: "diabetes-melitus" } });
        const root = (res.data?.data ?? res.data ?? {}) as any;

        const rawKonten: any[] = root.konten ?? root.materi ?? root.items ?? root ?? [];
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
              totalSoal: t.totalSoal ?? t.total_soal ?? t.jumlah_soal ?? undefined,
              durasiMenit: t.durasiMenit ?? t.duration ?? t.durasi ?? null,
              bank_id: t.bank_id ?? t.bankId ?? undefined,
              source: t.source,
              ...t,
            }))
          : [];

        if (!alive) return;
        setKonten(mappedKonten);
        setTes(mappedTes);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.response?.data?.message || "Gagal memuat materi.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* Screening per-user */
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingScreening(true);
      try {
        const listRes = await api.get("/user/diabetes-screenings");
        const raw = listRes?.data?.data ?? listRes?.data ?? [];
        const arr: any[] = Array.isArray(raw) ? raw : [];
        if (arr.length === 0) {
          if (!alive) return;
          setHistoryResults([]);
          setLatestResult(null);
          return;
        }
        arr.sort((a, b) => {
          const ta = a?.created_at ?? a?.date ?? a?.screened_at ?? a?.submitted_at ?? 0;
          const tb = b?.created_at ?? b?.date ?? b?.screened_at ?? b?.submitted_at ?? 0;
          return Date.parse(String(tb)) - Date.parse(String(ta));
        });
        const history = arr.map(mapScreening);
        if (!alive) return;
        setHistoryResults(history);

        const firstId = arr[0]?.id;
        if (firstId) {
          try {
            const detRes = await api.get(`/user/diabetes-screenings/${firstId}`);
            const detData = detRes?.data?.data ?? detRes?.data ?? {};
            if (!alive) return;
            setLatestResult(mapScreening(detData));
          } catch {
            if (!alive) return;
            setLatestResult(history[0]);
          }
        } else {
          if (!alive) return;
          setLatestResult(history[0] ?? null);
        }
      } catch {
        if (!alive) return;
        setHistoryResults([]);
        setLatestResult(null);
      } finally {
        if (!alive) return;
        setLoadingScreening(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const greenGrad = "from-emerald-500 to-teal-500";
  const gradients = useMemo(() => [greenGrad], [greenGrad]);

  const mulaiTest = (t: TesItem) => {
    router.push(`/dashboard/user/kuisioner/${t.id}`);
  };

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Edukasi & Hasil Screening Diabetes Melitus
              </h1>
              <p className="text-gray-600 mt-0.5">
                Lihat Hasil Screening Anda dan Pelajari Materi Edukasinya
              </p>
            </div>
          </div>
        </div>

        {/* =================== GRAFIK RIWAYAT SCREENING (PALING ATAS) =================== */}
        {!loading && historyResults.length > 0 && (
          <ScreeningLineChart data={historyResults} />
        )}

        {/* =================== HASIL SCREENING =================== */}
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-xl">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Hasil Screening Terbaru</h2>
                <p className="text-sm text-gray-600">
                  {loadingScreening
                    ? "Memuat…"
                    : latestResult
                    ? new Date(latestResult.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Belum ada hasil screening"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {loadingScreening ? (
              <div className="text-center py-10">
                <div className="inline-block relative">
                  <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                </div>
                <p className="text-sm text-gray-500 mt-4">Memuat hasil screening…</p>
              </div>
            ) : !latestResult ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-3">
                  <ClipboardList className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">Belum ada hasil screening</p>
                <p className="text-sm text-gray-500 mt-2">
                  Silakan lakukan screening diabetes untuk melihat hasil Anda
                </p>
              </div>
            ) : (
              <>
                {/* Banner status risiko */}
                {(() => {
                  const risk = computeRisk(
                    latestResult.diabetes_probability,
                    latestResult.diabetes_result
                  );
                  return (
                    <div
                      className={`rounded-2xl border-2 bg-gradient-to-r ${risk.theme.bg} ${risk.theme.border} p-5`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${risk.theme.badge}`}>
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Status Risiko</p>
                          <p className={`text-lg font-bold ${risk.theme.accentText}`}>
                            {risk.label}
                            <span className="ml-2 text-gray-800 font-semibold">
                              ({latestResult.diabetes_probability})
                            </span>
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Berdasarkan data screening terbaru
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* DATA SCREENING */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-gray-800 mb-3">Data Screening</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm h-full">
                      <p className="text-xs text-gray-500 mb-1">NAMA PASIEN</p>
                      <p className="font-semibold text-gray-900">{latestResult.patient_name}</p>
                    </div>
                    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm h-full">
                      <p className="text-xs text-gray-500 mb-1">USIA</p>
                      <p className="font-semibold text-gray-900">{latestResult.age} tahun</p>
                    </div>
                    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm h-full">
                      <p className="text-xs text-gray-500 mb-1">JENIS KELAMIN</p>
                      <p className="font-semibold text-gray-900">{latestResult.gender || "—"}</p>
                    </div>
                    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm h-full">
                      <p className="text-xs text-gray-500 mb-1">BMI</p>
                      <p className="font-semibold text-gray-900">{latestResult.bmi}</p>
                    </div>
                    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm h-full">
                      <p className="text-xs text-gray-500 mb-1">TEKANAN DARAH</p>
                      <p className="font-semibold text-gray-900">
                        {latestResult.systolic_bp}/{latestResult.diastolic_bp}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm h-full">
                      <p className="text-xs text-gray-500 mb-1">RIWAYAT MEROKOK</p>
                      <p className="font-semibold text-gray-900">
                        {latestResult.smoking_history || "Tidak Ada Data"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm h-full">
                      <p className="text-xs text-gray-500 mb-1">RIWAYAT JANTUNG</p>
                      <p className="font-semibold text-gray-900">
                        {latestResult.heart_disease || "Tidak Ada Data"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm h-full">
                      <p className="text-xs text-gray-500 mb-1">KLASIFIKASI HIPERTENSI</p>
                      <p className="font-semibold text-gray-900">
                        {latestResult.bp_classification}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm h-full">
                      <p className="text-xs text-gray-500 mb-1">GULA DARAH</p>
                      <p className="font-semibold text-gray-900">
                        {latestResult.blood_glucose_level} mg/dL
                      </p>
                    </div>
                  </div>
                </div>

                {latestResult.bp_recommendation && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                    <p className="font-semibold text-gray-900 mb-1">💡 Rekomendasi</p>
                    <p className="text-sm text-gray-800">{latestResult.bp_recommendation}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Riwayat + toggle */}
          <div className="px-6 py-5 border-t-2 border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Riwayat Screening</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowHistory((v) => !v)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-emerald-500 text-gray-700 hover:bg-emerald-50 transition"
                aria-expanded={showHistory}
              >
                {showHistory ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Tutup
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> Lihat
                  </>
                )}
              </button>
            </div>

            {loadingScreening ? (
              <div className="text-center py-8 text-gray-500">Memuat riwayat…</div>
            ) : showHistory ? (
              historyResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada riwayat screening sebelumnya
                </div>
              ) : (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 text-left">
                        <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                          TANGGAL
                        </th>
                        <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                          BMI
                        </th>
                        <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                          GULA DARAH
                        </th>
                        <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                          TEKANAN DARAH
                        </th>
                        <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                          HASIL
                        </th>
                        <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                          SKOR
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyResults.map((r) => {
                        const risk = computeRisk(r.diabetes_probability, r.diabetes_result);
                        return (
                          <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 text-sm text-gray-800">
                              {new Date(r.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="py-4 text-sm text-gray-800">{r.bmi}</td>
                            <td className="py-4 text-sm text-gray-800">
                              {r.blood_glucose_level} mg/dL
                            </td>
                            <td className="py-4 text-sm text-gray-800">
                              {r.systolic_bp}/{r.diastolic_bp}
                              <div className="text-xs text-gray-500">{r.bp_classification}</div>
                            </td>
                            <td className="py-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${risk.badgeClass}`}
                              >
                                {risk.label}
                              </span>
                            </td>
                            <td className="py-4 text-sm font-semibold text-gray-800">
                              {r.diabetes_probability}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : null}
          </div>
        </div>

        {/* =================== KUISONER / TES =================== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                  Kuisioner / Tes
                </h2>
                <p className="text-sm text-gray-600 mt-1 ml-4">
                  {loading ? "Memuat…" : `${tes.length} kuisioner tersedia`}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{tes.length} Kuisioner</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block relative">
                  <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4 font-medium">Memuat kuisioner…</p>
              </div>
            ) : tes.length === 0 ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-3">
                  <ClipboardList className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">Belum ada kuisioner untuk materi ini</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {tes.map((t) => {
                  const tipe = detectType(t.nama);
                  const baseKey = normalizeKey(t.nama);
                  const isPost = tipe === "post";
                  const mustLock = isPost && !preDoneMap[baseKey];

                  return (
                    <div
                      key={t.id}
                      className="group relative bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-transparent hover:shadow-2xl transition-all overflow-hidden"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity`}
                      />
                      <div
                        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-5 rounded-bl-full`}
                      />

                      <div className="relative flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold shadow`}
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
                              {isPost && (
                                <div className="mt-1">
                                  {mustLock ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                                      <LockIcon className="w-3.5 h-3.5" />
                                      Terkunci: Selesaikan Pre Test dulu
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Siap dikerjakan
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => !mustLock && mulaiTest(t)}
                              disabled={mustLock}
                              className={[
                                "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all shadow",
                                mustLock
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "text-white bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-700 hover:to-yellow-700 hover:shadow-lg",
                              ].join(" ")}
                              title={mustLock ? "Selesaikan Pre Test terlebih dahulu" : "Mulai"}
                            >
                              {mustLock ? (
                                <LockIcon className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                              {mustLock ? "Terkunci" : "Mulai"}
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
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* =================== DAFTAR KONTEN =================== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                  Daftar Konten
                </h2>
                <p className="text-sm text-gray-600 mt-1 ml-4">
                  {loading ? "Memuat…" : `${konten.length} konten tersedia untuk dipelajari`}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{konten.length} Materi</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block relative">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4 font-medium">Memuat materi edukasi…</p>
              </div>
            ) : konten.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-inner">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-700 font-bold text-lg mb-2">Belum ada materi</p>
                <p className="text-sm text-gray-500">Materi edukasi sedang dalam proses pembuatan</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {konten.map((it, i) => (
                  <div
                    key={it.id}
                    className="group relative bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-5 rounded-bl-full`}
                    />

                    <div className="relative flex items-start gap-5">
                      <div
                        className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
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
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-700 hover:to-yellow-700 transition-all shadow-md hover:shadow-xl hover:scale-105 font-semibold text-sm"
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
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-700 hover:to-blue-700 transition-all shadow-md hover:shadow-xl hover:scale-105 font-semibold text-sm"
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
                                  {new Date(it.created_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            )}
                            {it.updated_at && (
                              <>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5 text-emerald-600" />
                                  <span className="font-medium">
                                    Diperbarui:{" "}
                                    {new Date(it.updated_at).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
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
            💡 Tip: Unduh materi PDF untuk belajar offline dan tonton video untuk pemahaman yang
            lebih interaktif
          </p>
        </div>
      </div>
    </div>
  );
}
