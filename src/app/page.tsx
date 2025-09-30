import { GleamLogo } from "@/components/gleam-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      {/* Header */}
      <header className="border-b border-emerald-100/50 bg-white/70 backdrop-blur-xl shadow-sm relative z-10">
        <div className="container mx-auto px-4 py-5">
          <GleamLogo size="md" />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-24">
          {/* Animated Badge */}
          <div className="inline-block mb-6 px-6 py-2.5 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-700 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            ✨ Solusi Kesehatan Digital Terpercaya
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-8 text-balance leading-tight">
            Platform Monitoring
            <br />
            Kesehatan
            <span className="relative inline-block ml-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 animate-gradient">
                Diabetes
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-full"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 text-pretty leading-relaxed max-w-3xl mx-auto font-light">
            GLEAM menyediakan solusi terintegrasi untuk monitoring glukosa, pembelajaran, edukasi, dan pemantauan
            kesehatan diabetes melitus.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Button asChild size="lg" className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl shadow-emerald-300/50 hover:shadow-emerald-400/60 transition-all duration-300 px-10 py-7 text-lg font-semibold rounded-xl overflow-hidden">
              <Link href="/register/user">
                <span className="relative z-10">Daftar Sebagai Pasien</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="group border-2 border-emerald-600 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 px-10 py-7 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link href="/register/staff">
                <span>Daftar Sebagai Staff/Petugas</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section - Fakta Menarik Diabetes */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tahukah Kamu?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fakta penting tentang diabetes yang perlu kamu ketahui
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="group relative bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl hover:shadow-red-300/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="text-5xl font-bold mb-2">537 Juta</div>
                <div className="text-xl font-semibold mb-2">Penderita di Dunia</div>
                <p className="text-white/90 text-sm">Jumlah orang dewasa dengan diabetes di seluruh dunia pada tahun 2021</p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 text-white shadow-2xl hover:shadow-emerald-300/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="text-5xl font-bold mb-2">19.5 Juta</div>
                <div className="text-xl font-semibold mb-2">Penderita di Indonesia</div>
                <p className="text-white/90 text-sm">Indonesia menempati peringkat ke-5 tertinggi jumlah penderita diabetes</p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl hover:shadow-amber-300/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="text-5xl font-bold mb-2">50%</div>
                <div className="text-xl font-semibold mb-2">Tidak Terdiagnosis</div>
                <p className="text-white/90 text-sm">Hampir setengah penderita diabetes tidak menyadari kondisi mereka</p>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-10 border-2 border-blue-100 shadow-xl">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Pencegahan Lebih Baik dari Pengobatan</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Diabetes tipe 2 dapat dicegah atau ditunda dengan gaya hidup sehat: olahraga teratur 30 menit per hari, 
                  menjaga berat badan ideal, dan konsumsi makanan bergizi seimbang.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-blue-700 shadow-sm">🏃 Olahraga Rutin</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-blue-700 shadow-sm">🥗 Pola Makan Sehat</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-blue-700 shadow-sm">⚖️ Jaga Berat Badan</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-blue-700 shadow-sm">💤 Tidur Cukup</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <Card className="group text-center border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-300/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">Monitoring Glukosa</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <CardDescription className="text-gray-600 text-base leading-relaxed">Pantau kadar glukosa darah secara real-time dengan teknologi terdepan</CardDescription>
            </CardContent>
          </Card>

          <Card className="group text-center border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-300/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">Edukasi Diabetes</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <CardDescription className="text-gray-600 text-base leading-relaxed">Akses materi pembelajaran dan edukasi tentang pengelolaan diabetes</CardDescription>
            </CardContent>
          </Card>

          <Card className="group text-center border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-300/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">Forum Komunitas</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <CardDescription className="text-gray-600 text-base leading-relaxed">Bergabung dengan komunitas untuk berbagi pengalaman dan dukungan</CardDescription>
            </CardContent>
          </Card>

          <Card className="group text-center border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-300/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">Laporan Kesehatan</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <CardDescription className="text-gray-600 text-base leading-relaxed">Dapatkan laporan kesehatan komprehensif dan rekomendasi medis</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Login Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2rem] blur-2xl opacity-20"></div>
          <div className="relative text-center bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl p-12 max-w-3xl mx-auto border border-emerald-100/50">
            <div className="inline-block p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-800 mb-8 text-xl font-semibold">Sudah memiliki akun?</p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button asChild variant="ghost" className="group text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-lg py-7 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-emerald-200">
                <Link href="/login/user">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Masuk Sebagai Pasien
                  </span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className="group text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-lg py-7 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-emerald-200">
                <Link href="/login/staff">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Masuk Sebagai Staff/Petugas
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}