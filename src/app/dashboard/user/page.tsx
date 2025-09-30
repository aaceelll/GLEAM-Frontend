"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, Calendar, Heart, Apple, Droplet, BookOpen, Users, LineChart, Bell } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white p-8 rounded-3xl shadow-2xl mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Selamat Datang di GLEAM! 👋</h1>
              <p className="text-emerald-50 text-lg">
                Glucose, Learning, Education, and Monitoring - Partner kesehatan diabetes Anda
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-center">
                  <p className="text-emerald-100 text-sm mb-1">Terakhir Check-in</p>
                  <p className="text-3xl font-bold">2 jam</p>
                  <p className="text-emerald-100 text-xs">yang lalu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-8 space-y-8">
        {/* Health Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Glukosa Terakhir</CardTitle>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-5xl font-bold">120</div>
                <div className="text-blue-100 text-sm">mg/dL</div>
                <div className="flex items-center gap-2 bg-green-500/30 px-3 py-1 rounded-full w-fit">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold">Normal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Rata-rata 7 Hari</CardTitle>
                <div className="bg-white/20 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-5xl font-bold">118</div>
                <div className="text-emerald-100 text-sm">mg/dL</div>
                <div className="flex items-center gap-2 bg-emerald-300/30 px-3 py-1 rounded-full w-fit">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-semibold">Terkendali</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Cek Terakhir</CardTitle>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-5xl font-bold">2</div>
                <div className="text-purple-100 text-sm">jam yang lalu</div>
                <div className="flex items-center gap-2 bg-purple-300/30 px-3 py-1 rounded-full w-fit">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs font-semibold">Hari ini</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monitoring Kesehatan */}
          <Card className="lg:col-span-2 border-none shadow-xl bg-white hover:shadow-2xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 p-3 rounded-xl">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-800">Monitoring Kesehatan</CardTitle>
                  <CardDescription className="text-gray-600">
                    Pantau kondisi diabetes Anda secara real-time
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Link href="/dashboard/user/glucose-input" className="block">
                <Button className="w-full justify-start h-auto py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-4 w-full">
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <Droplet className="h-6 w-6" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-lg">Input Glukosa Darah</div>
                      <div className="text-blue-100 text-sm">Catat kadar gula darah Anda</div>
                    </div>
                    <div className="text-2xl">→</div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/user/activities" className="block">
                <Button className="w-full justify-start h-auto py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-4 w-full">
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <Activity className="h-6 w-6" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-lg">Catat Aktivitas Harian</div>
                      <div className="text-emerald-100 text-sm">Olahraga, makan, dan lainnya</div>
                    </div>
                    <div className="text-2xl">→</div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/user/history" className="block">
                <Button className="w-full justify-start h-auto py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-md hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-4 w-full">
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <LineChart className="h-6 w-6" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-lg">Lihat Grafik Kesehatan</div>
                      <div className="text-purple-100 text-sm">Analisis tren glukosa Anda</div>
                    </div>
                    <div className="text-2xl">→</div>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Sidebar: Tips Hari Ini */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-gray-800">Tips Hari Ini</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">💧</span>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Jaga Hidrasi</h4>
                    <p className="text-sm text-gray-600">
                      Minum minimal 8 gelas air putih sehari untuk menjaga kadar gula darah stabil.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🥗</span>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Sarapan Sehat</h4>
                    <p className="text-sm text-gray-600">
                      Jangan lewatkan sarapan! Pilih menu tinggi serat dan protein.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🚶</span>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Jalan Kaki</h4>
                    <p className="text-sm text-gray-600">
                      30 menit jalan kaki setelah makan membantu kontrol gula darah.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edukasi & Komunitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:shadow-2xl transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Edukasi Diabetes</CardTitle>
                  <CardDescription className="text-indigo-100">
                    Pelajari lebih lanjut tentang diabetes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/user/education">
                <Button variant="secondary" className="w-full justify-start h-auto py-3 bg-white/20 hover:bg-white/30 text-white border-none">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    <div className="text-left">
                      <div className="font-bold">Materi Edukasi Lengkap</div>
                      <div className="text-xs text-indigo-100">Panduan diabetes dari A-Z</div>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/user/forum">
                <Button variant="secondary" className="w-full justify-start h-auto py-3 bg-white/20 hover:bg-white/30 text-white border-none">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📖</span>
                    <div className="text-left">
                      <div className="font-bold">Tips & Artikel Kesehatan</div>
                      <div className="text-xs text-indigo-100">Update terbaru seputar diabetes</div>
                    </div>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white hover:shadow-2xl transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Komunitas</CardTitle>
                  <CardDescription className="text-teal-100">
                    Bergabung dengan komunitas diabetes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/user/forum">
                <Button variant="secondary" className="w-full justify-start h-auto py-3 bg-white/20 hover:bg-white/30 text-white border-none">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    <div className="text-left">
                      <div className="font-bold">Forum Komunitas</div>
                      <div className="text-xs text-teal-100">Diskusi dengan sesama pejuang diabetes</div>
                    </div>
                  </div>
                </Button>
              </Link>

              <Button variant="secondary" className="w-full justify-start h-auto py-3 bg-white/20 hover:bg-white/30 text-white border-none">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <div className="text-left">
                    <div className="font-bold">Grup Support</div>
                    <div className="text-xs text-teal-100">Dukungan emosional & motivasi</div>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Riwayat Terbaru */}
        <Card className="border-none shadow-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl">
            <CardTitle className="text-2xl text-gray-800">Riwayat Terbaru</CardTitle>
            <CardDescription>Aktivitas monitoring kesehatan Anda</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                <div className="bg-green-500 p-3 rounded-xl">
                  <Droplet className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">Glukosa darah: 120 mg/dL</h4>
                  <p className="text-sm text-gray-600">Hari ini, 14:30</p>
                </div>
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Normal
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                <div className="bg-blue-500 p-3 rounded-xl">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">Membaca artikel: Tips Diet Diabetes</h4>
                  <p className="text-sm text-gray-600">Kemarin, 19:45</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                <div className="bg-purple-500 p-3 rounded-xl">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">Bergabung di forum komunitas</h4>
                  <p className="text-sm text-gray-600">Kemarin, 19:45</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}