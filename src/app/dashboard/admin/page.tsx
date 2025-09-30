'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle2, Users, Briefcase, Stethoscope, UserRound } from 'lucide-react';

type DashboardStats = {
  totalAdmin: number;
  totalManajemen: number;
  totalNakes: number;
  totalUser: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

type CardStyle = {
  title: string;
  value: number;
  subtitle: string;
  icon: ReactNode;
  gradient: string;
  ring: string;
};

function StatCard({ card }: { card: CardStyle }) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-2xl p-6 shadow-sm ring-1 transition-all',
        'hover:shadow-lg hover:-translate-y-0.5',
        card.ring,
        `bg-gradient-to-br ${card.gradient}`,
      ].join(' ')}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl bg-white" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-32 w-32 rounded-full opacity-10 blur-2xl bg-black" />

      <div className="flex items-start justify-between">
        <div className="text-white/90">
          <p className="text-sm font-medium tracking-wide">{card.title}</p>
          <p className="mt-2 text-3xl font-extrabold text-white drop-shadow-sm">{card.value}</p>
          <p className="mt-1 text-xs text-white/80">{card.subtitle}</p>
        </div>

        <div className="shrink-0 grid h-12 w-12 place-items-center rounded-xl bg-white/20 backdrop-blur-sm text-white">
          {card.icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('gleam_token');
    if (!token) {
      router.replace('/login/staff');
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
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        let msg = 'Failed to fetch dashboard stats';
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
      setError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  }

  const cards: CardStyle[] = [
    {
      title: 'Total Akun Admin',
      value: stats?.totalAdmin ?? 0,
      subtitle: 'Total terdaftar',
      icon: <CheckCircle2 className="h-7 w-7" />,
      gradient: 'from-emerald-500 to-green-600',
      ring: 'ring-emerald-200/60',
    },
    {
      title: 'Total Akun Manajemen',
      value: stats?.totalManajemen ?? 0,
      subtitle: 'Total terdaftar',
      icon: <Briefcase className="h-7 w-7" />,
      gradient: 'from-sky-500 to-indigo-600',
      ring: 'ring-sky-200/60',
    },
    {
      title: 'Total Akun Nakes',
      value: stats?.totalNakes ?? 0,
      subtitle: 'Total terdaftar',
      icon: <Stethoscope className="h-7 w-7" />,
      gradient: 'from-fuchsia-500 to-purple-600',
      ring: 'ring-fuchsia-200/60',
    },
    {
      title: 'Total Akun User',
      value: stats?.totalUser ?? 0,
      subtitle: 'Total terdaftar',
      icon: <UserRound className="h-7 w-7" />,
      gradient: 'from-amber-500 to-orange-600',
      ring: 'ring-amber-200/60',
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6 pt-4 md:pt-6">
          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-6 ring-1 ring-gray-200 bg-white animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-36 rounded bg-gray-200" />
                    <div className="h-8 w-16 rounded bg-gray-200" />
                    <div className="h-3 w-24 rounded bg-gray-200" />
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

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Selamat Datang di Dashboard Admin
        </h1>

        {/* Info Box */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Hak Akses</p>
              <p className="text-sm text-blue-700">
                Anda memiliki akses penuh untuk mengelola data pengguna dan statistik sistem.
              </p>
            </div>
          </div>
        </div>

        {/* Sub Judul */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Statistik Pengguna</h2>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Users className="w-4 h-4" /> Total entitas yang terdaftar
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((c, i) => (
            <StatCard key={i} card={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
