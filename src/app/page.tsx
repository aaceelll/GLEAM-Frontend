"use client";

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
} from "lucide-react";
import Link from "next/link";
import { GleamLogo } from "@/components/gleam-logo";

export default function HomePage() {
  return (
    <>
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-emerald-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-20 right-1/3 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-teal-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-2000" />
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 md:py-5">
            {/* Kiri: Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <GleamLogo size="md" />
              <div className="hidden sm:block leading-tight" />
            </div>

            {/* Kanan: Auth dropdowns */}
            <div className="flex items-center gap-2 md:gap-3">
            <a
              href="/login"
              className="bg-emerald-400 hover:bg-emerald-600 text-white font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm md:text-base transition"
            >
              Masuk
            </a>

               <Link
                  href="/register/user"
                  className="group relative inline-flex h-9 md:h-11 px-4 md:px-6 items-center rounded-xl text-white font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <span className="relative z-10">Daftar</span>
                  <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full border-2 border-emerald-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-emerald-700 animate-pulse" />
              <span className="text-xs md:text-sm lg:text-base font-bold text-emerald-800">
                Platform Pembelajaran Gamifikasi #1 di Indonesia
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                Belajar Diabetes
              </span>
              <br />
              <span className="text-gray-900">Jadi Lebih Seru!</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
              Tingkatkan pengetahuan tentang diabetes melalui{" "}
              <span className="font-bold text-emerald-700">pembelajaran interaktif</span>,{" "}
              <span className="font-bold text-teal-700">kuis seru</span>, dan{" "}
              <span className="font-bold text-emerald-700">sistem reward</span> yang memotivasi!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-4 md:pt-6 px-4">
              <Link href="/register/user" className="w-full sm:w-auto">
                <Button
                  className="w-full sm:w-auto group relative px-6 md:px-10 py-5 md:py-7 text-base md:text-lg lg:text-xl font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all hover:-translate-y-1 overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    <Zap className="w-5 h-5 md:w-6 md:h-6" />
                    Mulai Belajar Gratis
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>

              <Link href="#features" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-6 md:px-10 py-5 md:py-7 text-base md:text-lg lg:text-xl font-bold rounded-2xl border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 hover:scale-105 shadow-lg transition-all"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 pt-8 md:pt-12 max-w-4xl mx-auto px-4">
              <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border-2 border-emerald-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="text-2xl md:text-3xl lg:text-4xl font-black text-emerald-700">1000+</div>
                <div className="text-xs md:text-sm lg:text-base text-gray-600 font-semibold mt-1 md:mt-2">Pengguna Aktif</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border-2 border-teal-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="text-2xl md:text-3xl lg:text-4xl font-black text-teal-700">500+</div>
                <div className="text-xs md:text-sm lg:text-base text-gray-600 font-semibold mt-1 md:mt-2">Materi Lengkap</div>
              </div>
              <div className="col-span-2 md:col-span-1 bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border-2 border-emerald-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="text-2xl md:text-3xl lg:text-4xl font-black text-emerald-700">98%</div>
                <div className="text-xs md:text-sm lg:text-base text-gray-600 font-semibold mt-1 md:mt-2">Tingkat Kepuasan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
              Kenapa Pilih <span className="text-emerald-700">GLEAM</span>?
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Platform pembelajaran yang dirancang khusus untuk membuat belajar diabetes lebih menyenangkan dan efektif
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* Feature Card 1 */}
            <div className="group bg-white p-6 md:p-8 rounded-3xl border-2 border-emerald-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Brain className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Pembelajaran Interaktif</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Materi disajikan dengan cara yang menarik dan mudah dipahami dengan visualisasi yang memukau
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group bg-white p-6 md:p-8 rounded-3xl border-2 border-teal-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-teal-300 transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Target className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Kuis & Tantangan</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Uji pemahaman Anda dengan kuis interaktif dan raih skor terbaik untuk naik peringkat
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group bg-white p-6 md:p-8 rounded-3xl border-2 border-emerald-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Sistem Reward</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Dapatkan poin, badge, dan achievement setiap kali menyelesaikan pembelajaran
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="group bg-white p-6 md:p-8 rounded-3xl border-2 border-teal-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-teal-300 transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Progress Tracking</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Pantau perkembangan belajar Anda dengan dashboard analytics yang lengkap
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="group bg-white p-6 md:p-8 rounded-3xl border-2 border-emerald-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Komunitas Aktif</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Bergabung dengan komunitas pembelajar lain dan saling berbagi pengalaman
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="group bg-white p-6 md:p-8 rounded-3xl border-2 border-teal-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-teal-300 transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Materi Lengkap</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Ratusan materi pembelajaran dari dasar hingga advanced tentang diabetes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
              Cara Kerja <span className="text-emerald-700">GLEAM</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Mulai perjalanan belajar Anda hanya dalam 3 langkah mudah
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-6 md:p-8 rounded-3xl shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-2 transition-all">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 md:mb-4 opacity-50">01</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Daftar Gratis</h3>
                  <p className="text-sm md:text-base text-emerald-50 leading-relaxed">
                    Buat akun Anda dalam hitungan detik dan mulai belajar
                  </p>
                </div>
                {/* Arrow - hidden on mobile */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-emerald-400">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white p-6 md:p-8 rounded-3xl shadow-2xl hover:shadow-teal-500/50 hover:-translate-y-2 transition-all">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 md:mb-4 opacity-50">02</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Pilih Materi</h3>
                  <p className="text-sm md:text-base text-teal-50 leading-relaxed">
                    Jelajahi ratusan materi pembelajaran yang tersedia
                  </p>
                </div>
                {/* Arrow - hidden on mobile */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-teal-400">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-6 md:p-8 rounded-3xl shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-2 transition-all">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 md:mb-4 opacity-50">03</div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Raih Achievement</h3>
                <p className="text-sm md:text-base text-emerald-50 leading-relaxed">
                  Kumpulkan poin, badge, dan naik level dalam belajar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/30 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
              Manfaat Belajar di <span className="text-emerald-700">GLEAM</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Dapatkan lebih dari sekedar pengetahuan
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="flex gap-4 md:gap-6 p-6 md:p-8 bg-white rounded-3xl border-2 border-emerald-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Pengetahuan Terpercaya</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Materi disusun oleh ahli kesehatan dan divalidasi oleh profesional medis
                </p>
              </div>
            </div>

            <div className="flex gap-4 md:gap-6 p-6 md:p-8 bg-white rounded-3xl border-2 border-teal-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Kesehatan Lebih Baik</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Tingkatkan pemahaman tentang diabetes untuk hidup yang lebih sehat
                </p>
              </div>
            </div>

            <div className="flex gap-4 md:gap-6 p-6 md:p-8 bg-white rounded-3xl border-2 border-emerald-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Motivasi Berkelanjutan</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Sistem gamifikasi membuat Anda tetap termotivasi untuk terus belajar
                </p>
              </div>
            </div>

            <div className="flex gap-4 md:gap-6 p-6 md:p-8 bg-white rounded-3xl border-2 border-teal-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Komunitas Supportif</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Terhubung dengan sesama pembelajar dan saling mendukung
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 px-4">
            <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" />
              <span className="text-xs md:text-sm font-bold text-white">
                Gratis Selamanya, Tanpa Biaya Tersembunyi
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight px-4">
              Siap Memulai Perjalanan Belajar Anda?
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/90 px-4 leading-relaxed">
              Bergabunglah dengan ribuan pengguna lain yang telah merasakan manfaat GLEAM
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-4 px-4">
              <Link href="/register/user" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 rounded-2xl font-bold text-base md:text-lg
                            bg-white text-emerald-700 border border-white/40
                            shadow-xl hover:shadow-2xl hover:scale-105
                            hover:bg-emerald-50 transition-all"
                >
                  Mulai Gratis Sekarang
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-bold text-base md:text-lg rounded-2xl border-2 border-white/50 transition-all"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
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
