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
  <div className={`p-4 md:p-6 ${className}`}>{children}</div>
);
const CardTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <h3 className={className}>{children}</h3>
);
const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`px-4 pb-4 md:px-6 md:pb-6 ${className}`}>{children}</div>
);
const CardDescription: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => <p className={className}>{children}</p>;

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
        className={`group relative inline-flex h-9 px-3 sm:h-10 sm:px-4 md:h-11 md:px-6 items-center rounded-2xl font-semibold text-sm md:text-base overflow-hidden transition-all
    ${label === "Daftar"
      ? "text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl"
      : "border-2 border-emerald-200 text-emerald-700 bg-emerald-50/50 backdrop-blur-sm hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-lg hover:-translate-y-0.5"
    }`}
      >
        <span className="relative z-10 flex items-center gap-1.5 md:gap-2">
          {label}
          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 opacity-80" />
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
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -right-40 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-emerald-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-20 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-teal-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 right-1/4 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-green-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Header – gradient kiri & kanan, pakai GleamLogo */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-100/50 backdrop-blur-xl">
        {/* Overlay gradient yang menyatu dengan halaman */}
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(900px 280px at -10% 0%, rgba(249, 254, 252, 1), transparent 60%), radial-gradient(900px 280px at 110% 0%, rgba(20,184,166,0.16), transparent 60%)",
            backgroundColor: "rgba(255,255,255,0.85)",
          }}
        />
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4 md:py-5">
            {/* Kiri: Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <GleamLogo size="md" />
              <div className="hidden sm:block leading-tight" />
            </div>

            {/* Kanan: Auth dropdowns */}
            <div className="flex items-center gap-2 md:gap-3">
              <DropdownButton
                label="Masuk"
                items={[
                  { label: "Masuk sebagai User", href: "/login/user" },
                  { label: "Masuk sebagai Staff", href: "/login/staff" },
                ]}
              />
              <DropdownButton
                label="Daftar"
                items={[
                  { label: "Daftar sebagai User", href: "/register/user" },
                  { label: "Daftar sebagai Staff", href: "/register/staff" },
                ]}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative z-10 pt-24 md:pt-32 pb-12 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-screen-xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Kiri – content */}
            <div className="space-y-6 md:space-y-8">
              <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs md:text-sm font-bold border border-emerald-200">
                ✨ Platform Monitoring Kesehatan #1 di Indonesia
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Kelola Diabetes dengan{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Lebih Mudah
                </span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                Platform terintegrasi untuk monitoring glukosa, pembelajaran interaktif, dan
                dukungan kesehatan diabetes melitus yang komprehensif.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link href="/register/user">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Mulai Sekarang Gratis
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="w-full sm:w-auto border-2 border-emerald-200 text-emerald-700 px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-bold rounded-2xl hover:bg-emerald-50 hover:border-emerald-400 transition-all">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-6 pt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 md:py-2 bg-white rounded-xl border border-emerald-200 hover:border-emerald-300 transition-all">
                  <Award className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                  <span className="text-xs md:text-sm font-semibold text-emerald-700">Sertifikat Resmi</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 md:py-2 bg-white rounded-xl border border-blue-200 hover:border-blue-300 transition-all">
                  <Shield className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                  <span className="text-xs md:text-sm font-semibold text-blue-700">Data Aman & Terenkripsi</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 md:py-2 bg-white rounded-xl border border-green-200 hover:border-green-300 transition-all">
                  <Users className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                  <span className="text-xs md:text-sm font-semibold text-green-700">Konsultasi Gratis</span>
                </div>
              </div>
            </div>

            {/* Kanan – preview dashboard */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative z-10 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 rounded-2xl md:rounded-3xl p-4 md:p-8 backdrop-blur-sm border-2 border-emerald-200/50 shadow-2xl">
                <div className="aspect-square bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6">
                  <div className="h-full flex flex-col space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <Activity className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-xs md:text-sm">Dashboard</div>
                          <div className="text-[10px] md:text-xs text-gray-500">Monitoring Real-time</div>
                        </div>
                      </div>
                      <Bell className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] md:text-xs font-semibold text-gray-600">Kadar Glukosa</span>
                        <span className="text-[10px] md:text-xs text-emerald-600 font-bold">Normal</span>
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-emerald-700 mb-1">
                        120 <span className="text-base md:text-lg">mg/dL</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                        <span>+5% dari kemarin</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:gap-3 flex-1">
                      <div className="bg-blue-50 rounded-lg p-2 md:p-3 border border-blue-200">
                        <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mb-1 md:mb-2" />
                        <div className="text-[10px] md:text-xs text-gray-600">Tekanan Darah</div>
                        <div className="text-xs md:text-sm font-bold text-blue-700">120/80</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-2 md:p-3 border border-purple-200">
                        <Heart className="w-4 h-4 md:w-5 md:h-5 text-purple-600 mb-1 md:mb-2" />
                        <div className="text-[10px] md:text-xs text-gray-600">Body Mass Index</div>
                        <div className="text-xs md:text-sm font-bold text-purple-700">23,4 kg/m²</div>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-2 md:p-3 border border-amber-200">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-amber-600 mb-1 md:mb-2" />
                        <div className="text-[10px] md:text-xs text-gray-600">Checkup Terakhir</div>
                        <div className="text-[10px] md:text-xs font-bold text-amber-700">2 hari lalu</div>
                      </div>
                      <div className="bg-rose-50 rounded-lg p-2 md:p-3 border border-rose-200">
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-rose-600 mb-1 md:mb-2" />
                        <div className="text-[10px] md:text-xs text-gray-600">Konsultasi</div>
                        <div className="text-[10px] md:text-xs font-bold text-rose-700">5 tersedia</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-emerald-400/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 md:w-40 md:h-40 bg-teal-400/30 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-12 md:py-20 lg:py-32 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-screen-xl">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs md:text-sm font-bold mb-4 border border-emerald-200">
              ✨ Fitur Unggulan
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Semua yang Anda Butuhkan dalam{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Satu Platform
              </span>
            </h3>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Akses lengkap ke tools monitoring, pembelajaran, dan dukungan kesehatan diabetes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Feature Card 1 */}
            <div className="group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Monitoring Real-time</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Pantau kadar glukosa dan tanda vital secara langsung dengan dashboard yang mudah dipahami
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-teal-100 hover:border-teal-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Edukasi Interaktif</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Akses materi pembelajaran lengkap tentang diabetes dengan video, artikel, dan kuis interaktif
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Screening Risiko</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Deteksi dini risiko diabetes dengan cerdas dan analisis AI yang akurat
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-purple-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Konsultasi Online</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Konsultasi langsung dengan tenaga kesehatan profesional kapan saja, di mana saja
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-amber-100 hover:border-amber-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Rekomendasi Personal</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Dapatkan rekomendasi personal untuk pola makan, olahraga, dan gaya hidup sehat
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-rose-100 hover:border-rose-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Laporan Kesehatan</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Generate laporan kesehatan komprehensif lengkap dengan analisis kesehatan dan riwayat screening Diabetes Melitus Anda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-12 md:py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-screen-xl">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-teal-100 text-teal-700 rounded-full text-xs md:text-sm font-bold mb-4 border border-teal-200">
              Cara Kerja
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Mudah Digunakan dalam 3 Langkah
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 max-w-5xl mx-auto relative">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="relative mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <span className="text-2xl md:text-3xl font-bold text-white">1</span>
                </div>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Daftar Gratis</h4>
              <p className="text-sm md:text-base text-gray-600">Buat akun dalam hitungan menit dengan data diri Anda</p>
            </div>

            {/* Arrow 1 to 2 */}
            <div className="hidden md:flex items-center justify-center absolute top-10 left-1/3 -translate-x-1/2 z-10">
              <ArrowRight className="w-8 h-8 text-emerald-400" strokeWidth={2.5} />
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="relative mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <span className="text-2xl md:text-3xl font-bold text-white">2</span>
                </div>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Input Data Kesehatan</h4>
              <p className="text-sm md:text-base text-gray-600">Masukkan data kesehatan Anda untuk screening awal</p>
            </div>

            {/* Arrow 2 to 3 */}
            <div className="hidden md:flex items-center justify-center absolute top-10 left-2/3 -translate-x-1/2 z-10">
              <ArrowRight className="w-8 h-8 text-teal-400" strokeWidth={2.5} />
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="relative mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <span className="text-2xl md:text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Monitoring & Konsultasi</h4>
              <p className="text-sm md:text-base text-gray-600">Pantau kesehatan dan konsultasi kapan saja</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative z-10 py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 max-w-screen-xl">
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-20 text-center shadow-2xl">
            <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Siap Mengelola Kesehatan Diabetes Anda?
              </h3>
              <p className="text-base md:text-lg lg:text-xl text-white/90">
                Bergabunglah dengan pengguna lain yang telah merasakan manfaat GLEAM
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Link href="/register/user">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 rounded-xl md:rounded-2xl font-bold text-base md:text-lg
                                bg-white text-emerald-700 border border-white/40
                                shadow-xl hover:shadow-2xl hover:scale-105
                                hover:bg-emerald-50 transition-all"
                  >
                    Mulai Gratis Sekarang
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-bold text-base md:text-lg rounded-xl md:rounded-2xl border-2 border-white/50 transition-all"
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
