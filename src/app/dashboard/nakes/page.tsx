"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { Users, Activity, FileText, Loader2, Home } from "lucide-react";

type SummaryPayload = {
  total_pasien: number;
  screening_hari_ini: number;
  laporan_bulan_ini: number;
};

type CardStyle = {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
};

function ymdInJakarta(d: Date) {
  const isoStr = d.toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" });
  const [ymd] = isoStr.split(" ");
  const [y, m, day] = ymd.split("-").map(Number);
  return { y, m, d: day };
}

function parseMaybeNaiveToDate(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  const str = String(val).trim();
  if (!str) return null;
  try {
    return new Date(str);
  } catch {
    return null;
  }
}

function StatCard({ card }: { card: CardStyle }) {
  const Icon = card.icon;
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradient} p-6 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:bg-white/30 transition-colors">
            {Icon}
          </div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
            Realtime
          </span>
        </div>

        <h3 className="text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform origin-left">
          {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
        </h3>
        <p className="text-sm font-semibold text-white/90 mb-1">{card.title}</p>
        <p className="text-xs text-white/70">{card.subtitle}</p>
      </div>
    </div>
  );
}

export default function NakesDashboard() {
  const [summary, setSummary] = useState<SummaryPayload | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadSummary() {
    setLoading(true);
    
    try {
      // 🔥 LANGSUNG PAKAI FALLBACK - TIDAK FETCH API
      // Hitung manual dari screening data
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

      setSummary({
        total_pasien: unique.size,
        screening_hari_ini: todayCount,
        laporan_bulan_ini: monthCount,
      });
    } catch (err) {
      console.error("Error loading screenings:", err);
      // Fallback ke data kosong
      setSummary({
        total_pasien: 0,
        screening_hari_ini: 0,
        laporan_bulan_ini: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
    // Refresh setiap 5 menit
    const interval = setInterval(loadSummary, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fmt = (n?: number) =>
    typeof n === "number" ? new Intl.NumberFormat("id-ID").format(n) : "—";

  const cards: CardStyle[] = useMemo(
    () => [
      {
        title: "Total Pasien",
        value: loading ? "..." : fmt(summary?.total_pasien),
        subtitle: "Data terdaftar",
        icon: <Users className="h-6 w-6 text-white" />,
        gradient: "from-emerald-500 to-teal-600",
      },
      {
        title: "Screening Hari Ini",
        value: loading ? "..." : fmt(summary?.screening_hari_ini),
        subtitle: "Update rutin",
        icon: <Activity className="h-6 w-6 text-white" />,
        gradient: "from-teal-500 to-cyan-600",
      },
      {
        title: "Laporan Bulan Ini",
        value: loading ? "..." : fmt(summary?.laporan_bulan_ini),
        subtitle: "Periode berjalan",
        icon: <FileText className="h-6 w-6 text-white" />,
        gradient: "from-cyan-500 to-green-600",
      },
    ],
    [summary, loading]
  );

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="mb-2">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 grid place-items-center shadow-2xl group-hover:scale-110 transition-all duration-500">
                <Home className="h-8 w-8 text-white" />
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

        {/* Info Akses */}
        <div className="mt-4 p-3 md:p-4 bg-emerald-50 border-2 border-emerald-100 rounded-xl">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-500 grid place-items-center flex-shrink-0">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-emerald-900 text-sm md:text-base">Hak Akses</p>
              <p className="text-xs md:text-sm text-emerald-700">
                Anda memiliki akses untuk mengelola screening dan melihat ringkasan pasien.
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Memuat data dashboard...</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {cards.map((card, idx) => (
              <StatCard key={idx} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}