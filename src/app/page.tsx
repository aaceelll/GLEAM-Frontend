"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { GleamLogo } from "@/components/gleam-logo";
import {
  Activity,
  BookOpen,
  Heart,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  Calendar,
  Bell,
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  Award,
  Smartphone,
  Brain,
  HeartPulse,
} from "lucide-react";

/* ===== Lightweight UI helpers (agar file mandiri) ===== */
type ButtonVariant = "default" | "ghost" | "outline";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  className?: string;
};
const Button: React.FC<ButtonProps> = ({ children, variant = "default", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center font-semibold transition-all cursor-pointer border-0";
  const variantCls =
    variant === "ghost"
      ? "bg-transparent"
      : variant === "outline"
      ? "bg-white"
      : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white";
  return (
    <button className={`${base} ${variantCls} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl ${className}`}>{children}</div>
);
const CardHeader: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
const CardTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <h3 className={className}>{children}</h3>
);
const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`px-6 pb-6 ${className}`}>{children}</div>
);
const CardDescription: React.FC<React.PropsWithChildren<{
  className?: string;
}>> = ({ children, className = "" }) => <p className={className}>{children}</p>;

/* ================== Page ================== */

function DropdownButton({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on click outside / esc
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`group relative inline-flex h-10 px-4 sm:h-11 sm:px-6 items-center rounded-2xl font-semibold overflow-hidden transition-all
    ${label === "Daftar"
      ? "text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl"
      : "border-2 border-emerald-200 text-emerald-700 bg-emerald-50/50 backdrop-blur-sm hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-lg hover:-translate-y-0.5"
    }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          {label}
          <ChevronDown className="w-4 h-4 opacity-80" />
        </span>
        {label !== "Daftar" && (
          <>
            <span className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 rounded-xl ring-2 ring-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </button>

      {/* dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl border-2 border-gray-100 bg-white shadow-xl overflow-hidden z-50"
          role="menu"
        >
          {items.map((it, i) => (
            <Link
              key={i}
              href={it.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
              role="menuitem"
            >
              {it.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -right-40 w-[38rem] h-[38rem] md:w-[44rem] md:h-[44rem] bg-emerald-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-20 w-[34rem] h-[34rem] md:w-[40rem] md:h-[40rem] bg-teal-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 right-1/4 w-[38rem] h-[38rem] md:w-[44rem] md:h-[44rem] bg-green-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-100/50 backdrop-blur-xl">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(900px 280px at -10% 0%, rgba(249, 254, 252, 1), transparent 60%), radial-gradient(900px 280px at 110% 0%, rgba(20,184,166,0.16), transparent 60%)",
            backgroundColor: "rgba(255,255,255,0.85)",
          }}
        />
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4 md:py-5">
            {/* Logo */}
            <div className="flex items-center gap-3 min-w-0">
              <GleamLogo size="md" />
              <div className="hidden sm:block leading-tight" />
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="group relative inline-flex h-10 sm:h-11 px-4 sm:px-6 items-center rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <span className="relative z-10">Masuk</span>
                <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full duration-700" />
                </span>
              </Link>

              <Link
                href="/register/user"
                className="group relative inline-flex h-10 sm:h-11 px-4 sm:px-6 items-center rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <span className="relative z-10">Daftar</span>
                <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full duration-700" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 sm:px-6 pt-28 sm:pt-32 md:pt-40 pb-14 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Kiri */}
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-200 rounded-full shadow-md hover:shadow-lg transition-all">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              <span className="text-xs sm:text-sm font-bold text-emerald-700">Platform Kesehatan Digital Terpercaya</span>
            </div>

            <div>
              <h1 className="text-[28px] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
                Monitoring
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600">
                  Diabetes
                </span>
                <br />
                Lebih Mudah
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                Platform terintegrasi untuk monitoring glukosa, pembelajaran interaktif, dan pemantauan kesehatan
                diabetes melitus secara real-time.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/register/user">
                <Button className="w-full sm:w-auto group px-5 sm:px-8 py-3.5 sm:py-4 text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Mulai Sekarang
                    <TrendingUp className="ml-2 w-5 h-5 hidden sm:inline group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 border-2 border-emerald-200 text-emerald-700 bg-emerald-50/50 backdrop-blur-sm font-bold text-base sm:text-lg rounded-2xl hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-lg transition-all"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 sm:pt-6">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-50/80 rounded-full border border-emerald-200 hover:border-emerald-300 transition-all">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-xs sm:text-sm font-semibold text-emerald-700">Keamanan Data Terjamin</span>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-teal-50/80 rounded-full border border-teal-200 hover:border-teal-300 transition-all">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span className="text-xs sm:text-sm font-semibold text-teal-700">Mudah Digunakan</span>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-50/80 rounded-full border border-green-200 hover:border-green-300 transition-all">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-xs sm:text-sm font-semibold text-green-700">Konsultasi Gratis</span>
              </div>
            </div>
          </div>

          {/* Kanan – preview dashboard */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative z-10 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm border-2 border-emerald-200/50 shadow-2xl">
              <div className="aspect-[4/3] sm:aspect-video lg:aspect-square bg-white rounded-2xl shadow-xl p-4 sm:p-5 md:p-6">
                <div className="h-full flex flex-col space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-xs sm:text-sm">Dashboard</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Monitoring Real-time</div>
                      </div>
                    </div>
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 sm:p-4 border border-emerald-200">
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-600">Kadar Glukosa</span>
                      <span className="text-[10px] sm:text-xs text-emerald-600 font-bold">Normal</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-1">
                      120 <span className="text-sm sm:text-lg">mg/dL</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      <span>+5% dari kemarin</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1">
                    <div className="bg-blue-50 rounded-lg p-2.5 sm:p-3 border border-blue-200">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mb-1.5 sm:mb-2" />
                      <div className="text-[10px] sm:text-xs text-gray-600">Tekanan Darah</div>
                      <div className="text-xs sm:text-sm font-bold text-blue-700">120/80</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2.5 sm:p-3 border border-purple-200">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mb-1.5 sm:mb-2" />
                      <div className="text-[10px] sm:text-xs text-gray-600">Body Mass Index</div>
                      <div className="text-xs sm:text-sm font-bold text-purple-700">23,4 kkg/m²</div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2.5 sm:p-3 border border-amber-200">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mb-1.5 sm:mb-2" />
                      <div className="text-[10px] sm:text-xs text-gray-600">Checkup Terakhir</div>
                      <div className="text-[10px] sm:text-xs font-bold text-amber-700">2 hari lalu</div>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-2.5 sm:p-3 border border-rose-200">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 mb-1.5 sm:mb-2" />
                      <div className="text-[10px] sm:text-xs text-gray-600">Konsultasi</div>
                      <div className="text-[10px] sm:text-xs font-bold text-rose-700">5 tersedia</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-400/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 sm:w-40 sm:h-40 bg-teal-400/30 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 py-14 md:py-24 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 border border-emerald-200">
              Fitur Unggulan
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Semua yang Anda Butuhkan untuk{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Kesehatan Diabetes
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              Platform lengkap dengan teknologi terkini untuk monitoring dan edukasi diabetes
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            <div className="group bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Monitoring Real-time</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Pantau kadar glukosa darah Anda secara real-time dengan grafik interaktif dan notifikasi otomatis
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-6 sm:p-8 border-2 border-teal-100 hover:border-teal-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Edukasi Interaktif</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Akses materi pembelajaran lengkap tentang diabetes dengan video, artikel, dan kuis interaktif
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-6 sm:p-8 border-2 border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Screening Risiko</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Deteksi dini risiko diabetes dengan cerdas dan analisis AI yang akurat
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-6 sm:p-8 border-2 border-purple-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Konsultasi Online</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Konsultasi langsung dengan tenaga kesehatan profesional kapan saja, di mana saja
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-6 sm:p-8 border-2 border-amber-100 hover:border-amber-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Rekomendasi Personal</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Dapatkan rekomendasi personal untuk pola makan, olahraga, dan gaya hidup sehat
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-6 sm:p-8 border-2 border-rose-100 hover:border-rose-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Laporan Kesehatan</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Generate laporan kesehatan komprehensif lengkap dengan analisis kesehatan dan riwayat screening Diabetes Melitus Anda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 py-14 md:py-24 bg-white">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-teal-100 text-teal-700 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 border border-teal-200">
              Cara Kerja
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Mudah Digunakan dalam 3 Langkah
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto relative">
            <div className="text-center relative">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <span className="text-2xl sm:text-3xl font-bold text-white">1</span>
                </div>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Daftar Gratis</h4>
              <p className="text-gray-600 text-sm sm:text-base">Buat akun dalam hitungan menit dengan data diri Anda</p>
            </div>

            <div className="hidden md:flex items-center justify-center absolute top-10 left-1/3 -translate-x-1/2 z-10">
              <ArrowRight className="w-8 h-8 text-emerald-400" strokeWidth={2.5} />
            </div>

            <div className="text-center relative">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <span className="text-2xl sm:text-3xl font-bold text-white">2</span>
                </div>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Input Data Kesehatan</h4>
              <p className="text-gray-600 text-sm sm:text-base">Masukkan data kesehatan Anda untuk screening awal</p>
            </div>

            <div className="hidden md:flex items-center justify-center absolute top-10 left-2/3 -translate-x-1/2 z-10">
              <ArrowRight className="w-8 h-8 text-teal-400" strokeWidth={2.5} />
            </div>

            <div className="text-center relative">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <span className="text-2xl sm:text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Monitoring & Konsultasi</h4>
              <p className="text-gray-600 text-sm sm:text-base">Pantau kesehatan dan konsultasi kapan saja</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative z-10 py-14 md:py-24">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6">
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20 text-center shadow-2xl">
            <div className="absolute top-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Siap Mengelola Kesehatan Diabetes Anda?
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-white/90">
                Bergabunglah dengan pengguna lain yang telah merasakan manfaat GLEAM
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href="/register/user">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg
                                bg-white text-emerald-700 border border-white/40
                                shadow-xl hover:shadow-2xl hover:scale-[1.02]
                                hover:bg-emerald-50 transition-all"
                  >
                    Mulai Gratis Sekarang
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-bold text-base sm:text-lg rounded-2xl border-2 border-white/50 transition-all"
                  >
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (optional, tetap dikomentari) */}

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </>
  );
}
