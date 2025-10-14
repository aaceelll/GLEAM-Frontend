"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Activity,
  AlertCircle,
  CheckCircle2,
  Loader2,
  BarChart3,
  Heart
} from "lucide-react";
import { api } from "@/lib/api";

interface DashboardStats {
  total_pedalangan: number;
  total_padangsari: number;
  diabetes_cases: number;
  status_normal: number;
  status_perhatian: number;
  status_risiko: number;
  growth_percentage: number;
  affected_percentage: number;
}

export default function DashboardManajemen() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get("/manajemen/statistics");
      if (data.success) {
        const d = data.data;
        setStats({
          total_pedalangan: d.total_pedalangan || 0,
          total_padangsari: d.total_padangsari || 0,
          diabetes_cases: d.total_keseluruhan || 0,
          status_normal: d.risk_summary?.normal ?? 0,
          status_perhatian: d.risk_summary?.perhatian ?? 0,
          // ← gunakan nilai backend apa adanya (tanpa dummy)
          status_risiko: d.risk_summary?.risiko ?? 0,
          growth_percentage: 12.5,
          affected_percentage: d.affected_percentage ?? 0,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-16 w-16 text-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Memuat dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Dashboard Manajemen
              </h1>
              <p className="text-base md:text-lg text-gray-600 font-medium">
                Kelola dan pantau data kesehatan secara keseluruhan
              </p>
            </div>
          </div>
        </header>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tidak mengirim `trend` → badge persentase tidak muncul */}
          <StatsCard
            title="Total Kasus Diabetes"
            value={stats.diabetes_cases}
            subtitle="Pasien terdaftar di sistem"
            icon={<Heart className="h-6 w-6 text-white" />}
            gradient="from-emerald-500 to-teal-600"
          />
          <StatsCard
            title="Pedalangan"
            value={stats.total_pedalangan}
            subtitle="Kasus terdaftar"
            icon={<MapPin className="h-6 w-6 text-white" />}
            gradient="from-teal-500 to-cyan-600"
            trend="11 RW"
          />
          <StatsCard
            title="Padangsari"
            value={stats.total_padangsari}
            subtitle="Kasus terdaftar"
            icon={<MapPin className="h-6 w-6 text-white" />}
            gradient="from-emerald-600 to-green-700"
            trend="17 RW"
          />
        </div>

        {/* Kondisi Kesehatan */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Kondisi Kesehatan</h2>
              <p className="text-sm text-emerald-700">Fokus: Diabetes Melitus</p>
            </div>
          </div>

          <Card className="relative overflow-hidden border-2 border-emerald-100 bg-white rounded-3xl shadow-sm transition-all duration-500 hover:border-emerald-300 hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1">
            <CardContent className="p-6">
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusCard
                  title="Status Normal"
                  count={stats.status_normal}
                  subtitle="peserta dalam kondisi sehat"
                  icon={<CheckCircle2 className="h-6 w-6" />}
                  color="emerald"
                />
                <StatusCard
                  title="Perlu Perhatian"
                  count={stats.status_perhatian}
                  subtitle="peserta dengan risiko sedang"
                  icon={<AlertCircle className="h-6 w-6" />}
                  color="amber"
                />
                <StatusCard
                  title="Risiko Tinggi"
                  count={stats.status_risiko}
                  subtitle="peserta memerlukan intervensi"
                  icon={<Activity className="h-6 w-6" />}
                  color="red"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ===== Components ===== */
interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  /** opsional; jika tidak diberikan, badge tren disembunyikan */
  trend?: string;
}

function StatsCard({ title, value, subtitle, icon, gradient, trend }: StatsCardProps) {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-100`}></div>
      <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-0 transition-transform duration-700"></div>
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          {typeof trend === "string" && trend.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white">
              {trend}
            </span>
          )}
        </div>
        <h3 className="text-4xl font-black text-white mb-2">{value.toLocaleString()}</h3>
        <p className="text-sm font-semibold text-white/90 mb-1">{title}</p>
        <p className="text-xs text-white/70">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

interface StatusCardProps {
  title: string;
  count: number;
  subtitle: string;
  icon: React.ReactNode;
  color: "emerald" | "amber" | "red";
}

function StatusCard({ title, count, subtitle, icon, color }: StatusCardProps) {
  const colors = {
    emerald: {
      bg: "from-emerald-50 to-teal-50",
      border: "border-emerald-200",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      text: "text-emerald-900",
      subtitle: "text-emerald-600",
    },
    amber: {
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-200",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      text: "text-amber-900",
      subtitle: "text-amber-600",
    },
    red: {
      bg: "from-red-50 to-rose-50",
      border: "border-red-200",
      iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
      text: "text-red-900",
      subtitle: "text-red-600",
    },
  } as const;

  const style = colors[color];

  return (
    <Card className={`group border-2 ${style.border} bg-gradient-to-br ${style.bg} hover:shadow-lg transition-all duration-300 hover:scale-105`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-black ${style.text}`}>{title}</h3>
          </div>
        </div>
        <p className={`text-3xl font-black ${style.text} mb-1`}>{count.toLocaleString()}</p>
        <p className={`text-xs font-medium ${style.subtitle}`}>{subtitle}</p>
      </CardContent>
    </Card>
  );
}
