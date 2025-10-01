"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Heart, AlertTriangle, CheckCircle } from "lucide-react"

export default function ManajemenDashboard() {
  // Kondisi Kesehatan (hanya DM)
  const dmSummary = { cases: 342, percentage: 68 }

  return (
    <div className="px-6 md:px-10 py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <BarChart3 className="h-8 w-8 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Dashboard Manajemen
              </h1>
              <p className="text-base md:text-lg text-gray-600 mt-1 font-medium">Kelola dan pantau data kesehatan secara keseluruhan</p>
            </div>
          </div>
        </header>

        {/* ===== BARIS 1: Kondisi Kesehatan (Full Width) ===== */}
        <Card className="border-2 border-orange-100 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="flex items-center gap-3 border-b border-gray-100 bg-white">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">Kondisi Kesehatan</CardTitle>
              <CardDescription className="text-sm text-gray-600">Fokus: Diabetes Melitus</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kartu ringkas */}
              <Card className="border-2 border-orange-200 bg-orange-50/60 rounded-2xl shadow-sm">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-900">Diabetes Melitus</h4>
                    <p className="text-sm text-orange-700">{dmSummary.cases} kasus terdata</p>
                  </div>
                </CardContent>
              </Card>

              {/* Progress clean */}
              <div className="rounded-2xl border-2 border-gray-100 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800">Persentase Populasi Terdampak</span>
                  <span className="text-sm font-bold text-gray-900">{dmSummary.percentage}%</span>
                </div>
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                    style={{ width: `${dmSummary.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Estimasi berdasarkan pemeriksaan terakhir</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== BARIS 2: 3 Alert Card ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Normal */}
          <Card className="border-2 border-emerald-200 bg-emerald-50/50 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900 mb-1">Status Normal</h4>
                <p className="text-sm text-emerald-700">1,847 peserta dalam kondisi sehat</p>
              </div>
            </CardContent>
          </Card>

          {/* Perlu Perhatian */}
          <Card className="border-2 border-orange-200 bg-orange-50/50 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-orange-900 mb-1">Perlu Perhatian</h4>
                <p className="text-sm text-orange-700">543 peserta dengan risiko sedang</p>
              </div>
            </CardContent>
          </Card>

          {/* Risiko Tinggi */}
          <Card className="border-2 border-red-200 bg-red-50/50 shadow-lg rounded-2xl">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-red-900 mb-1">Risiko Tinggi</h4>
                <p className="text-sm text-red-700">457 peserta memerlukan intervensi</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
