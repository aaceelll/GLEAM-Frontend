"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Calendar, Bell, Home } from "lucide-react";
import { api } from "@/lib/api";

/* === Kartu gradient (UI sama persis: angka besar + unit kecil) === */
function StatGradientCard({
  title,
  value,
  unit,
  icon,
  gradient,
  chip,
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  gradient: string; // e.g. "from-emerald-500 to-teal-600"
  chip?: string | null;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-0 transition-transform duration-700" />
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm grid place-items-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white">{icon}</span>
          </div>
          {chip ? (
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white">
              {chip}
            </span>
          ) : null}
        </div>

        <div className="flex items-baseline gap-3 mb-2">
          <div className="text-5xl font-black text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          {unit && <div className="text-xl text-white/80">{unit}</div>}
        </div>
        <h3 className="text-sm font-semibold text-white/90">{title}</h3>
      </div>
    </div>
  );
}

type Tip = { icon: string; title: string; desc: string };

function TipCard({ tip }: { tip: Tip }) {
  return (
    <Card className="group border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 grid place-items-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
            <span aria-hidden>{tip.icon}</span>
          </div>
          <h4 className="text-lg font-bold text-emerald-900">{tip.title}</h4>
        </div>
        <p className="text-sm font-medium text-emerald-700">{tip.desc}</p>
      </CardContent>
    </Card>
  );
}

// Ubah helper agar bisa terima epoch ms langsung
function sinceParts(
  msOrIso?: number | string | null,
  now: number = Date.now()
): { amount: number | null; unit: string | null } {
  if (msOrIso == null) return { amount: null, unit: null };

  let t: number;
  if (typeof msOrIso === "number") t = msOrIso;
  else {
    const parsed = Date.parse(msOrIso);
    if (isNaN(parsed)) return { amount: null, unit: null };
    t = parsed;
  }

  const diffMs = Math.max(0, now - t);
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return { amount: Math.max(1, sec), unit: "detik yang lalu" };
  const min = Math.floor(sec / 60);
  if (min < 60) return { amount: min, unit: "menit yang lalu" };
  const hr = Math.floor(min / 60);
  if (hr < 24) return { amount: hr, unit: "jam yang lalu" };
  const day = Math.floor(hr / 24);
  return { amount: day, unit: "hari yang lalu" };
}

function useNow(interval: number = 1000) {
  const [now, setNow] = React.useState<number>(() => Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}

export default function UserDashboard() {
  const [lastGlucose, setLastGlucose] = useState<number | null>(null);
  const [lastAtMs, setLastAtMs] = useState<number | null>(null);   // ⬅️ simpan epoch ms
  const [lastAtIso, setLastAtIso] = useState<string | null>(null); // ⬅️ untuk chip tanggal
  const [chip, setChip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // tick tiap 1 detik (boleh ganti 10_000 kalau mau per 10 dtk)
const now = useNow(1000);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/user/dashboard/summary");
        if (data?.success) {
          setLastGlucose(data.data?.last_glucose ?? null);
          setLastAtMs(data.data?.last_created_at_ms ?? null);
          setLastAtIso(data.data?.last_created_at_iso ?? null);
          setChip(data.data?.label ?? null);
        }
      } catch (e) {
        console.error("Gagal memuat ringkas dashboard user:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Hitung angka + unit (realtime) dari epoch ms
  const { amount, unit } = sinceParts(lastAtMs, now);

  const tips: Tip[] = [
    { icon: "💧", title: "Jaga Hidrasi", desc: "Minum minimal 8 gelas air putih sehari" },
    { icon: "🥗", title: "Sarapan Sehat", desc: "Pilih menu tinggi serat dan protein" },
    { icon: "🚶", title: "Jalan Kaki", desc: "30 menit setelah makan bantu kontrol gula darah" },
  ];

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
                Selamat Datang di GLEAM
              </h1>
              <p className="text-base md:text-lg text-gray-600 font-medium">
                Partner kesehatan diabetes Anda
              </p>
            </div>
          </div>
        </header>

        {/* Kartu Statistik (UI seperti awal) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 md:mt-6">
          <StatGradientCard
            title="Glukosa Terakhir"
            value={loading ? "…" : (lastGlucose ?? "-")}
            unit={lastGlucose != null ? "mg/dL" : undefined}
            icon={<Activity className="h-6 w-6" />}
            gradient="from-emerald-500 to-teal-600"
            chip={chip ?? undefined}
          />

          <StatGradientCard
            title="Cek Terakhir"
            value={loading ? "…" : (amount ?? "-")}
            unit={amount != null ? unit ?? "" : undefined}
            icon={<Calendar className="h-6 w-6" />}
            gradient="from-teal-500 to-cyan-600"
            chip={lastAtIso ? new Date(lastAtIso).toLocaleDateString("id-ID") : undefined}
          />
        </div>

        {/* Tips Hari Ini */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tips Hari Ini</h2>
              <p className="text-sm text-emerald-700">Panduan singkat untuk rutinitas sehat</p>
            </div>
          </div>

          <Card className="relative overflow-hidden border-2 border-emerald-100 bg-white rounded-3xl shadow-sm transition-all duration-500 hover:border-emerald-300 hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {tips.map((t, i) => (
                  <TipCard key={i} tip={t} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

