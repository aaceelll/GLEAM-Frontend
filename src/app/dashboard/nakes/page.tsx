"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import {
  Users,
  Activity,
  FileText,
  Stethoscope,
  BarChart3,
  Shield,
} from "lucide-react";

/* ========== Types ========== */
type SummaryPayload = {
  total_pasien: number;
  screening_hari_ini: number;
  laporan_bulan_ini: number;
};

/* ========== Utils Waktu (Asia/Jakarta) ========== */
const TZ = "Asia/Jakarta";

function parseMaybeNaiveToDate(s?: string): Date | null {
  if (!s) return null;
  let val = String(s).trim();
  const hasOffset = /[+-]\d{2}:\d{2}$/.test(val);
  const hasZ = /Z$/.test(val);
  const isoish = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(val);

  if (isoish && !hasOffset && !hasZ) {
    val = val.replace(" ", "T") + "Z";
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

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

/* ========== Card ========== */
type CardStyle = {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string; // gunakan untuk latar gradient hijau
};

function StatCard({ card }: { card: CardStyle }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
      {/* background gradient ala manajemen/admin */}
      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
      {/* overlay halus */}
      <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-0 transition-transform duration-700" />
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm grid place-items-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white">{card.icon}</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white">
            Realtime
          </span>
        </div>

        <h3 className="text-4xl md:text-5xl font-black text-white mb-2">
          {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
        </h3>
        <p className="text-sm font-semibold text-white/90 mb-1">{card.title}</p>
        <p className="text-xs text-white/70">{card.subtitle}</p>
      </div>
    </div>
  );
}

/* ========== PAGE ========== */
export default function NakesDashboard() {
  const [summary, setSummary] = useState<SummaryPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadSummary() {
    setLoading(true);
    setErrorMsg(null);
    try {
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
        } catch {}
      }

      if (!data) {
        const res = await api.get("/nakes/diabetes-screenings");
        const arr = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        const now = new Date();
        const today = ymdInJakarta(now);

        const unique = new Set<string | number>();
        let todayCount = 0;
        let monthCount = 0;

        for (const it of arr) {
          const uid =
            it.user_id ??
            it.user?.id ??
            it.userId ??
            it.nama ??
            it.name ??
            it.patient_name ??
            it.id;
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
        gradient: "from-emerald-500 to-teal-600",
      },
      {
        title: "Screening Hari Ini",
        value: loading ? "—" : fmt(summary?.screening_hari_ini),
        subtitle: "Update harian",
        icon: <Activity className="h-6 w-6" />,
        gradient: "from-teal-500 to-cyan-600",
      },
      {
        title: "Laporan Bulan Ini",
        value: loading ? "—" : fmt(summary?.laporan_bulan_ini),
        subtitle: "Periode berjalan",
        icon: <FileText className="h-6 w-6" />,
        gradient: "from-emerald-600 to-green-700",
      },
    ],
    [loading, summary]
  );

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header — seragam seperti admin/manajemen */}
        <header className="mb-2">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 grid place-items-center shadow-2xl group-hover:scale-110 transition-all duration-500">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Dashboard Nakes
              </h1>
              <p className="text-base md:text-lg text-gray-600 font-medium">
                Ringkasan pelayanan & pemantauan lapangan
              </p>
            </div>
          </div>
        </header>

        {/* Info strip (emerald) - UPDATED FOR RESPONSIVE */}
        <div className="mt-4 p-3 md:p-4 bg-emerald-50 border-2 border-emerald-100 rounded-xl">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-500 grid place-items-center flex-shrink-0">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-emerald-900 text-sm md:text-base">Hak Akses</p>
              <p className="text-xs md:text-sm text-emerald-700">
                Anda memiliki akses untuk mengelola screening dan melihat ringkasan pasien.
              </p>
            </div>
          </div>
        </div>

        {/* Error strip */}
        {errorMsg && (
          <div className="rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
            {errorMsg}
          </div>
        )}

        {/* 3 kartu (match gaya admin/manajemen) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <StatCard key={i} card={c} />
          ))}
        </div>
      </div>
    </div>
  );
}