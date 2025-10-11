import { GleamLogo } from "@/components/gleam-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Activity, BookOpen, Heart, MessageSquare, FileText, Clock, CheckCircle2, TrendingUp, Users, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -right-40 w-[500px] h-[500px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-[500px] h-[500px] bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-20 bg-white/80 backdrop-blur-xl border-b border-emerald-100/50 sticky top-0 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <GleamLogo size="md" />
            
            <div className="flex items-center gap-3">
              <Link href="/login/user">
                <Button variant="ghost" className="text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 font-semibold rounded-xl">
                  Masuk
                </Button>
              </Link>
              <Link href="/register/user">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-200 rounded-full shadow-md hover:shadow-lg transition-all">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">Platform Kesehatan Digital Terpercaya</span>
            </div>

            {/* Heading */}
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
                Platform terintegrasi untuk monitoring glukosa, pembelajaran interaktif, dan pemantauan kesehatan diabetes melitus secara real-time.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register/user">
                <Button className="w-full sm:w-auto group px-8 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                  Mulai Sekarang
                  <TrendingUp className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="w-full sm:w-auto px-8 py-6 border-2 border-gray-200 text-gray-700 font-bold text-lg rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
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

          {/* Right Image Placeholder */}
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 rounded-3xl p-8 backdrop-blur-sm border-2 border-emerald-200/50 shadow-2xl">
              <div className="aspect-square bg-white rounded-2xl shadow-xl flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <Activity className="w-24 h-24 mx-auto text-emerald-600" />
                  <div className="space-y-2">
                    <div className="h-3 bg-emerald-100 rounded-full w-3/4 mx-auto"></div>
                    <div className="h-3 bg-teal-100 rounded-full w-1/2 mx-auto"></div>
                    <div className="h-3 bg-green-100 rounded-full w-2/3 mx-auto"></div>
                  </div>
                  <p className="text-gray-500 font-medium text-sm">Dashboard Monitoring Kesehatan</p>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-400/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-teal-400/30 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 bg-gradient-to-b from-white to-emerald-50/30 py-20 md:py-32">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-4 border border-emerald-200">
              Fitur Unggulan
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Solusi Lengkap untuk Kesehatan Anda
            </h2>
            <p className="text-xl text-gray-600">
              Kelola diabetes dengan lebih baik melalui teknologi modern dan pendampingan profesional
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Monitoring */}
            <Card className="group relative overflow-hidden border-2 border-gray-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Monitoring Real-time</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Pantau kadar gula darah, tekanan darah, dan indikator kesehatan lainnya secara real-time dengan visualisasi yang mudah dipahami.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 - Edukasi */}
            <Card className="group relative overflow-hidden border-2 border-gray-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Edukasi Interaktif</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Akses materi edukasi lengkap tentang diabetes, pola hidup sehat, dan tips mengelola kondisi kesehatan Anda.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 - Screening */}
            <Card className="group relative overflow-hidden border-2 border-gray-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Screening Kesehatan</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Lakukan screening diabetes mandiri dengan AI yang akurat dan dapatkan rekomendasi kesehatan yang personal.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 - Konsultasi */}
            <Card className="group relative overflow-hidden border-2 border-gray-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Konsultasi Online</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Tanyakan pertanyaan kesehatan Anda langsung kepada tenaga kesehatan profesional melalui forum konsultasi.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 5 - Laporan */}
            <Card className="group relative overflow-hidden border-2 border-gray-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Laporan Kesehatan</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Generate laporan kesehatan lengkap dan komprehensif untuk dibawa saat konsultasi dengan dokter.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 6 - Reminder */}
            <Card className="group relative overflow-hidden border-2 border-gray-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Pengingat Otomatis</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Dapatkan pengingat untuk cek kesehatan rutin, minum obat, dan jadwal konsultasi agar tidak terlewat.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 md:py-32 bg-white">
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
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Daftar Gratis</h4>
              <p className="text-gray-600">Buat akun dalam hitungan menit dengan data diri Anda</p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Input Data Kesehatan</h4>
              <p className="text-gray-600">Masukkan data kesehatan Anda untuk screening awal</p>
            </div>

            {/* Step 3 */}
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
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl p-12 md:p-20 text-center shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h3 className="text-4xl md:text-5xl font-bold text-white">
                Siap Mengelola Kesehatan Diabetes Anda?
              </h3>
              <p className="text-xl text-white/90">
                Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat GLEAM
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register/user">
                  <Button className="px-8 py-6 bg-white text-emerald-600 hover:bg-gray-50 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                    Mulai Gratis Sekarang
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="px-8 py-6 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-bold text-lg rounded-2xl border-2 border-white/50 transition-all">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <GleamLogo size="md" />
              <p className="text-gray-400 text-sm">
                Platform monitoring kesehatan diabetes terpercaya untuk Indonesia.
              </p>
            </div>

            {/* Links */}
            <div>
              <h5 className="font-bold mb-4">Fitur</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Monitoring</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Edukasi</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Screening</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Konsultasi</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-4">Perusahaan</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Tentang Kami</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Tim</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Karir</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Kontak</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Privasi</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Syarat & Ketentuan</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Kebijakan Cookie</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 GLEAM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}