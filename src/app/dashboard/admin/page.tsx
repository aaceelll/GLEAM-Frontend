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
} from "lucide-react";

type DashboardStats = {
  totalAdmin: number;
  totalManajemen: number;
  totalNakes: number;
  totalUser: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/* =========================================================
   Card style type (tetap ada biar logic lama nggak berubah)
   ========================================================= */
type CardStyle = {
  title: string;
  value: number;
  subtitle: string;
  icon: ReactNode;
  gradient: string; // tidak dipakai (UI diseragamkan ke emerald)
  ring: string;     // tidak dipakai
};

/* ==========================================
   Shared hover gaya seperti Beranda User
   ========================================== */
const hoverCard =
  "group relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-white " +
  "transition-all duration-500 hover:border-emerald-400 " +
  "hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1";

/* =========================
   Stat Card (UI baru)
   ========================= */
function StatCard({ card }: { card: CardStyle }) {
  return (
    <div className={hoverCard}>
      {/* sweep highlight seperti user dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-semibold text-gray-600">{card.title}</p>
            <p className="mt-2 text-4xl md:text-5xl font-bold text-gray-900">
              {card.value}
            </p>
            <p className="mt-1 text-sm text-gray-500">{card.subtitle}</p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            {/* icon yang dikirim dari array */}
            <span className="text-white">{card.icon}</span>
          </div>
        </div>

        {/* aksen status kecil (seragam) */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">
            Terdaftar
          </span>
        </div>
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
      gradient: "",
      ring: "",
    },
    {
      title: "Total Akun Manajemen",
      value: stats?.totalManajemen ?? 0,
      subtitle: "Total terdaftar",
      icon: <Briefcase className="h-6 w-6" />,
      gradient: "",
      ring: "",
    },
    {
      title: "Total Akun Nakes",
      value: stats?.totalNakes ?? 0,
      subtitle: "Total terdaftar",
      icon: <Stethoscope className="h-6 w-6" />,
      gradient: "",
      ring: "",
    },
    {
      title: "Total Akun User",
      value: stats?.totalUser ?? 0,
      subtitle: "Total terdaftar",
      icon: <UserRound className="h-6 w-6" />,
      gradient: "",
      ring: "",
    },
  ];

  /* ================= Skeleton ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto space-y-6 pt-2">
          <div className="h-8 w-80 bg-gray-100 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-emerald-100 bg-white p-6 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-4 w-36 rounded bg-gray-200" />
                    <div className="h-10 w-20 rounded bg-gray-200" />
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
      <div className="min-h-screen bg-white p-6">
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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header (match user style) */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Selamat Datang di Dashboard Admin
            </h1>
            <p className="text-gray-600 mt-1">
              Ringkasan akun & aktivitas sistem
            </p>
          </div>
        </div>

        {/* Info strip (diseragamkan ke emerald) */}
        <div className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-emerald-900">Hak Akses</p>
              <p className="text-sm text-emerald-700">
                Anda memiliki akses penuh untuk mengelola data pengguna dan
                statistik sistem.
              </p>
            </div>
          </div>
        </div>

        {/* Subjudul */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Statistik Pengguna
          </h2>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Users className="w-4 h-4" /> Total entitas yang terdaftar
          </div>
        </div>

        {/* Cards (UI & hover sama seperti user) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((c, i) => (
            <StatCard key={i} card={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
