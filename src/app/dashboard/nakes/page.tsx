"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Users, Activity, FileText } from "lucide-react";

/* ========== Types ========== */
type SummaryPayload = {
  total_pasien: number;
  screening_hari_ini: number;
  laporan_bulan_ini: number;
};

/* ========== Utils Waktu (Asia/Jakarta) ========== */
const TZ = "Asia/Jakarta";

/** Normalisasi string tanggal backend → Date yang bisa diformat ke Asia/Jakarta */
function parseMaybeNaiveToDate(s?: string): Date | null {
  if (!s) return null;
  let val = String(s).trim();
  const hasOffset = /[+-]\d{2}:\d{2}$/.test(val);
  const hasZ = /Z$/.test(val);
  const isoish = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(val);

  // Jika backend kirim "YYYY-MM-DD HH:mm:ss" tanpa offset → treat as UTC supaya konsisten
  if (isoish && !hasOffset && !hasZ) {
    val = val.replace(" ", "T") + "Z";
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

/** Ambil {y,m,d} di timezone Asia/Jakarta dari sebuah Date */
function ymdInJakarta(d: Date) {
  const fmt = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(d);
  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const da = Number(parts.find((p) => p.type === "day")?.value);
  return { y, m, d: da };
}

/* ========== Kartu statistik (UI) ========== */
type CardStyle = { title: string; value: number | string; subtitle: string; icon: React.ReactNode };

const hoverCard =
  "group relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-white " +
  "transition-all duration-500 hover:border-emerald-400 " +
  "hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1";

function StatCard({ card }: { card: CardStyle }) {
  return (
    <div className={hoverCard}>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-semibold text-gray-600">{card.title}</p>
            <p className="mt-2 text-4xl md:text-5xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-1 text-sm text-gray-500">{card.subtitle}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <span className="text-white">{card.icon}</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">Realtime</span>
        </div>
      </div>
    </div>
  );
}

/* ========== PAGE ========== */
export default function NakesDashboard() {
  const [summary, setSummary] = useState<SummaryPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1) Coba ambil dari summary endpoint; 2) Kalau gagal, hitung dari /nakes/diabetes-screenings
  async function loadSummary() {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Coba beberapa varian summary endpoint terlebih dahulu
      const endpoints = [
        "/nakes/dashboard/summary",
        "/nakes/dashboard",
        "/dashboard/nakes/summary",
      ];

      let data: any | null = null;
      for (const p of endpoints) {
        try {
          const res = await api.get(p);
          data = res?.data?.data ?? res?.data ?? null;
          if (data) break;
        } catch {
          // lanjut coba endpoint berikutnya
        }
      }

      if (!data) {
        // === Fallback: rakit sendiri dari list screenings ===
        const res = await api.get("/nakes/diabetes-screenings");
        const arr = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        const now = new Date();
        const today = ymdInJakarta(now);

        // agregasi
        const unique = new Set<string | number>();
        let todayCount = 0;
        let monthCount = 0;

        for (const it of arr) {
          const uid =
            it.user_id ?? it.user?.id ?? it.userId ?? it.nama ?? it.name ?? it.patient_name ?? it.id;
          unique.add(uid);

          const rawDate =
            it.screened_at ?? it.created_at ?? it.date ?? it.submitted_at ?? null;
          const d = parseMaybeNaiveToDate(rawDate);
          if (!d) continue;

          const ymd = ymdInJakarta(d);
          if (ymd.y === today.y && ymd.m === today.m) monthCount++;
          if (ymd.y === today.y && ymd.m === today.m && ymd.d === today.d) todayCount++;
        }

        data = {
          total_pasien: unique.size,
          screening_hari_ini: todayCount,
          laporan_bulan_ini: monthCount,
        };
      }

      const s: SummaryPayload = {
        total_pasien:
          data.total_pasien ?? data.totalPasien ?? data.total_patient ?? data.patients ?? 0,
        screening_hari_ini:
          data.screening_hari_ini ?? data.screeningToday ?? data.today_screening ?? 0,
        laporan_bulan_ini:
          data.laporan_bulan_ini ?? data.monthly_reports ?? data.reportsThisMonth ?? 0,
      };

      setSummary(s);
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message || "Gagal memuat ringkasan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  const fmt = (n?: number) =>
    typeof n === "number" ? new Intl.NumberFormat("id-ID").format(n) : "—";

  const cards: CardStyle[] = useMemo(
    () => [
      {
        title: "Total Pasien",
        value: loading ? "—" : fmt(summary?.total_pasien),
        subtitle: "Data terdaftar",
        icon: <Users className="h-6 w-6" />,
      },
      {
        title: "Screening Hari Ini",
        value: loading ? "—" : fmt(summary?.screening_hari_ini),
        subtitle: "Update harian",
        icon: <Activity className="h-6 w-6" />,
      },
      {
        title: "Laporan Bulan Ini",
        value: loading ? "—" : fmt(summary?.laporan_bulan_ini),
        subtitle: "Periode berjalan",
        icon: <FileText className="h-6 w-6" />,
      },
    ],
    [loading, summary]
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard Nakes</h1>
            <p className="text-gray-600 mt-0.5">Selamat datang di panel tenaga kesehatan GLEAM</p>
          </div>
        </div>

        {/* Error strip */}
        {errorMsg && (
          <div className="rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
            {errorMsg}
          </div>
        )}

        {/* 3 Kartu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <StatCard key={i} card={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
