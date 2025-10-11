"use client";

import React from "react";
import Link from "next/link";
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
const CardDescription: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => <p className={className}>{children}</p>;

/* ================== Page ================== */

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 -right-40 w-[500px] h-[500px] bg-emerald-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-1/2 w-[500px] h-[500px] bg-green-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        {/* Header – gradient kiri & kanan, pakai GleamLogo */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-100/50 backdrop-blur-xl">
          {/* Overlay gradient yang menyatu dengan halaman */}
          <div
            className="absolute inset-0 -z-10 opacity-90"
            style={{
              backgroundImage:
                "radial-gradient(900px 280px at -10% 0%, rgba(16,185,129,0.16), transparent 60%), radial-gradient(900px 280px at 110% 0%, rgba(20,184,166,0.16), transparent 60%)",
              backgroundColor: "rgba(255,255,255,0.85)",
            }}
          />
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-5">
              {/* Kiri: Logo + arti singkat (tanpa teks 'GLEAM' agar tidak dobel) */}
              <div className="flex items-center gap-3">
                <GleamLogo size="md" />
                <div className="hidden sm:block leading-tight">
                </div>
              </div>

              {/* Kanan: Auth buttons – tidak mepet */}
              <div className="flex items-center gap-3">
                <Link
                  href="/login/user"
                  className="group relative inline-flex h-11 px-6 items-center rounded-xl text-gray-700 font-semibold overflow-hidden transition-all hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Masuk</span>
                  <span className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute inset-0 rounded-xl ring-2 ring-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                  href="/register/user"
                  className="group relative inline-flex h-11 px-6 items-center rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
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

        {/* Hero Section */}
        <section className="relative z-10 container mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Kiri */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-200 rounded-full shadow-md hover:shadow-lg transition-all">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">Platform Kesehatan Digital Terpercaya</span>
              </div>

              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                  Monitoring
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600">
                    Diabetes
                  </span>
                  <br />
                  Lebih Mudah
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl">
                  Platform terintegrasi untuk monitoring glukosa, pembelajaran interaktif, dan pemantauan kesehatan
                  diabetes melitus secara real-time.
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="w-full sm:w-auto group px-8 py-6 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                  Mulai Sekarang
                  <TrendingUp className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-6 border-2 border-gray-200 text-gray-700 font-bold text-lg rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">1000+</div>
                  <div className="text-sm text-gray-600 mt-1">Pengguna Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">24/7</div>
                  <div className="text-sm text-gray-600 mt-1">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">99%</div>
                  <div className="text-sm text-gray-600 mt-1">Kepuasan</div>
                </div>
              </div>
            </div>

            {/* Kanan – preview dashboard */}
            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 rounded-3xl p-8 backdrop-blur-sm border-2 border-emerald-200/50 shadow-2xl">
                <div className="aspect-square bg-white rounded-2xl shadow-xl p-6">
                  <div className="h-full flex flex-col space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">Dashboard</div>
                          <div className="text-xs text-gray-500">Monitoring Real-time</div>
                        </div>
                      </div>
                      <Bell className="w-5 h-5 text-emerald-600" />
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">Kadar Glukosa</span>
                        <span className="text-xs text-emerald-600 font-bold">Normal</span>
                      </div>
                      <div className="text-3xl font-bold text-emerald-700 mb-1">
                        120 <span className="text-lg">mg/dL</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                        <span>+5% dari kemarin</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <BarChart3 className="w-5 h-5 text-blue-600 mb-2" />
                        <div className="text-xs text-gray-600">Tekanan Darah</div>
                        <div className="text-sm font-bold text-blue-700">120/80</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <Heart className="w-5 h-5 text-purple-600 mb-2" />
                        <div className="text-xs text-gray-600">Detak Jantung</div>
                        <div className="text-sm font-bold text-purple-700">72 bpm</div>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                        <Calendar className="w-5 h-5 text-amber-600 mb-2" />
                        <div className="text-xs text-gray-600">Checkup Terakhir</div>
                        <div className="text-xs font-bold text-amber-700">2 hari lalu</div>
                      </div>
                      <div className="bg-rose-50 rounded-lg p-3 border border-rose-200">
                        <Users className="w-5 h-5 text-rose-600 mb-2" />
                        <div className="text-xs text-gray-600">Konsultasi</div>
                        <div className="text-xs font-bold text-rose-700">5 tersedia</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-400/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-teal-400/30 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative z-10 py-20 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-bold mb-4 border border-teal-200">
                Cara Kerja
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Mudah Digunakan dalam 3 Langkah
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center relative">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Daftar Gratis</h4>
                <p className="text-gray-600">Buat akun dalam hitungan menit dengan data diri Anda</p>
              </div>

              <div className="text-center relative">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Input Data Kesehatan</h4>
                <p className="text-gray-600">Masukkan data kesehatan Anda untuk screening awal</p>
              </div>

              <div className="text-center relative">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Monitoring & Konsultasi</h4>
                <p className="text-gray-600">Pantau kesehatan dan konsultasi kapan saja</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="relative z-10 py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl p-12 md:p-20 text-center shadow-2xl">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />

              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h3 className="text-4xl md:text-5xl font-bold text-white">
                  Siap Mengelola Kesehatan Diabetes Anda?
                </h3>
                <p className="text-xl text-white/90">
                  Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat GLEAM
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Lebih muda agar tidak nyaru */}
                  <Link href="/register/user">
                    <Button
                      variant="outline"
                      className="px-8 py-6 rounded-2xl font-bold text-lg
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
                      className="px-8 py-6 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-bold text-lg rounded-2xl border-2 border-white/50 transition-all"
                    >
                      Pelajari Lebih Lanjut
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-gradient-to-b from-white to-emerald-50/30">
          <div className="container mx-auto px-6 py-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border-2 border-emerald-100/60">
              <div className="grid gap-10 md:grid-cols-4">
                <div className="space-y-4">
                  <GleamLogo size="md" />
                  <p className="text-sm text-gray-600">
                    Platform monitoring kesehatan diabetes terpercaya untuk Indonesia.
                  </p>
                  <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
                </div>

                <div>
                  <h5 className="text-gray-900 font-semibold mb-4">Fitur</h5>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-gray-600 hover:text-emerald-700 transition-colors">Monitoring</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-emerald-700 transition-colors">Edukasi</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-emerald-700 transition-colors">Screening</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-emerald-700 transition-colors">Konsultasi</a></li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-gray-900 font-semibold mb-4">Perusahaan</h5>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-gray-600 hover:text-emerald-700 transition-colors">Tentang Kami</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-emerald-700 transition-colors">Tim</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-emerald-700 transition-colors">Karir</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-emerald-700 transition-colors">Kontak</a></li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-gray-900 font-semibold mb-4">Legal</h5>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-gray-600 hover:text-emerald-700 transition-colors">Privasi</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-emerald-700 transition-colors">Syarat & Ketentuan</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-emerald-700 transition-colors">Kebijakan Cookie</a></li>
                  </ul>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-emerald-100/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">© 2025 GLEAM. All rights reserved.</p>
                <div className="text-xs text-gray-500">
                  Dibuat dengan <span className="text-emerald-600 font-semibold">GLEAM Design System</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

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
