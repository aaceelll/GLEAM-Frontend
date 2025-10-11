"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  Briefcase,
  Stethoscope,
  UserRound,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

type DashboardStats = {
  totalAdmin: number;
  totalManajemen: number;
  totalNakes: number;
  totalUser: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/* ========= Card style type (keep for logic compatibility) ========= */
type CardStyle = {
  title: string;
  value: number;
  subtitle: string;
  icon: ReactNode;
  gradient: string; // now USED for bg gradient like manajemen
  ring: string;     // unused, kept for compatibility
};

/* =========================
   Stat Card (match manajemen)
   ========================= */
function StatCard({ card }: { card: CardStyle }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
      {/* gradient background like manajemen */}
      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-100`} />
      {/* subtle skew overlay */}
      <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-0 transition-transform duration-700" />
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm grid place-items-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white">{card.icon}</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white">
            Terdaftar
          </span>
        </div>

        <h3 className="text-4xl md:text-5xl font-black text-white mb-2">
          {card.value.toLocaleString()}
        </h3>
        <p className="text-sm font-semibold text-white/90 mb-1">{card.title}</p>
        <p className="text-xs text-white/70">{card.subtitle}</p>
      </div>
    </div>
  );
}

/* =========================
   PAGE
   ========================= */
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("gleam_token");
    if (!token) {
      router.replace("/login/staff");
      return;
    }
    fetchDashboardStats(token);
  }, [router]);

  async function fetchDashboardStats(token: string) {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        let msg = "Failed to fetch dashboard stats";
        try {
          const j = await response.json();
          msg = j?.message ?? msg;
        } catch {}
        throw new Error(msg);
      }

      const json = await response.json();
      setStats(json.data as DashboardStats);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }

  const cards: CardStyle[] = [
  {
    title: "Total Akun Admin",
    value: stats?.totalAdmin ?? 0,
    subtitle: "Total terdaftar",
    icon: <CheckCircle2 className="h-6 w-6" />,
    gradient: "from-emerald-500 to-teal-600",
    ring: "",
  },
  {
    title: "Total Akun Manajemen",
    value: stats?.totalManajemen ?? 0,
    subtitle: "Total terdaftar",
    icon: <Briefcase className="h-6 w-6" />,
    gradient: "from-teal-500 to-cyan-600",
    ring: "",
  },
  {
    title: "Total Akun Nakes",
    value: stats?.totalNakes ?? 0,
    subtitle: "Total terdaftar",
    icon: <Stethoscope className="h-6 w-6" />,
    gradient: "from-cyan-500 to-green-600",
    ring: "",
  },
  {
    title: "Total Akun User",
    value: stats?.totalUser ?? 0,
    subtitle: "Total terdaftar",
    icon: <UserRound className="h-6 w-6" />,
    gradient: "from-green-500 to-teal-700",
    ring: "",
  },
];


  /* ================= Skeleton ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 w-80 bg-gray-100 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-gray-100 bg-white p-6 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-4 w-36 rounded bg-gray-200" />
                    <div className="h-10 w-24 rounded bg-gray-200" />
                    <div className="h-3 w-28 rounded bg-gray-200" />
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= Error ================= */
  if (error) {
    return (
      <div className="min-h-screen bg-white px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
            {error}
          </div>
        </div>
      </div>
    );
  }

  /* ================= Page ================= */
  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header — match manajemen style */}
        <header className="mb-2">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 grid place-items-center shadow-2xl group-hover:scale-110 transition-all duration-500">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Dashboard Admin
              </h1>
              <p className="text-base md:text-lg text-gray-600 font-medium">
                Ringkasan akun & aktivitas sistem
              </p>
            </div>
          </div>
        </header>

        {/* Info strip (emerald) */}
        <div className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 grid place-items-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-emerald-900">Hak Akses</p>
              <p className="text-sm text-emerald-700">
                Anda memiliki akses penuh untuk mengelola data pengguna dan statistik sistem.
              </p>
            </div>
          </div>
        </div>

        {/* Subjudul */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
          {/* <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
            <Users className="h-6 w-6 text-white" />
          </div> */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Statistik Pengguna</h2>
            <p className="text-sm text-emerald-700">Total Akun yang Terdaftar</p>
          </div>
        </div>

        {/* Baris 1: 2 card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[cards[0], cards[1]].map((c, i) => (
            <StatCard key={`row1-${i}`} card={c} />
          ))}
        </div>

        {/* Baris 2: 2 card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[cards[2], cards[3]].map((c, i) => (
            <StatCard key={`row2-${i}`} card={c} />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
