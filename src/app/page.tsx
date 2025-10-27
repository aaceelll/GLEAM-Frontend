"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Brain,
  Users,
  TrendingUp,
  BookOpen,
  Target,
  Award,
  Zap,
  Shield,
  Heart,
  Activity,
  Bell,
  BarChart3,
  Calendar,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { GleamLogo } from "@/components/gleam-logo";

// Dropdown menu component
function AuthDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`group relative px-3 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 ${label === "Daftar"
      ? "text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl"
      : "border-2 border-emerald-200 text-emerald-700 bg-emerald-50/50 backdrop-blur-sm hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-lg hover:-translate-y-0.5"
    }`}
      >
        <span className="relative z-10 flex items-center gap-2">
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
        <div className="absolute top-0 -right-40 w-[500px] h-[500px] bg-emerald-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-20 w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-green-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-100/50 backdrop-blur-xl">
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
            {/* Logo */}
            <div className="flex items-center gap-3">
              <GleamLogo size="md" />
              <div className="hidden sm:block leading-tight" />
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              <AuthDropdown
                label="Masuk"
                items={[
                  { label: "Masuk sebagai User", href: "/login/user" },
                  { label: "Masuk sebagai Staff", href: "/login/staff" },
                ]}
              />
              <AuthDropdown
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

      {/* Hero */}
      <section className="relative z-10 pt-24 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-screen-xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Kiri – teks */}
            <div className="space-y-6 md:space-y-8">
              <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs md:text-sm font-bold border border-emerald-200">
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
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5">
                    Mulai Sekarang Gratis
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="w-full sm:w-auto border-2 border-emerald-200 text-emerald-700 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-bold rounded-2xl hover:bg-emerald-50 hover:border-emerald-400 transition-all">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-emerald-200 hover:border-emerald-300 transition-all">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs md:text-sm font-semibold text-emerald-700">Sertifikat Resmi</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-blue-200 hover:border-blue-300 transition-all">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs md:text-sm font-semibold text-blue-700">Data Aman & Terenkripsi</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-green-200 hover:border-green-300 transition-all">
                  <Users className="w-4 h-4 text-green-600" />
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
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs md:text-sm font-bold mb-4 border border-emerald-200">
              ✨ Fitur Unggulan
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 md:mb-6">
              Semua yang Anda Butuhkan dalam <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Satu Platform</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
              Akses lengkap ke tools monitoring, pembelajaran, dan dukungan kesehatan diabetes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Feature Cards */}
            <div className="group bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 border-emerald-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Activity className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Monitoring Real-time</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Pantau kadar glukosa dan vital signs Anda secara langsung dengan visualisasi yang mudah dipahami
              </p>
            </div>

            <div className="group bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 border-teal-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-teal-300 transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Brain className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Pembelajaran Interaktif</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Materi edukasi lengkap tentang diabetes dengan metode pembelajaran yang menyenangkan
              </p>
            </div>

            <div className="group bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 border-emerald-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Konsultasi Expert</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Terhubung langsung dengan tenaga kesehatan profesional untuk konsultasi kesehatan Anda
              </p>
            </div>

            <div className="group bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 border-teal-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-teal-300 transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Target className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Goal Setting</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Tetapkan dan lacak target kesehatan Anda dengan sistem reminder yang pintar
              </p>
            </div>

            <div className="group bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 border-emerald-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Library Lengkap</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Akses ribuan artikel, video, dan panduan kesehatan diabetes yang terverifikasi
              </p>
            </div>

            <div className="group bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 border-teal-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-teal-300 transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Gamifikasi</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Raih pencapaian dan reward menarik saat Anda konsisten menjaga kesehatan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 md:py-24 lg:py-32 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        </div>

        <div className="container mx-auto relative z-10 max-w-4xl">
          <div className="text-center space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" />
              <span className="text-xs md:text-sm font-bold text-white">
                Gratis Selamanya, Tanpa Biaya Tersembunyi
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              Siap Memulai Perjalanan Sehat Anda?
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/90">
              Bergabunglah dengan ribuan pengguna lain yang telah merasakan manfaat GLEAM
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4">
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
      </section>

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
