"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function LokasiPersebaran() {
  const pedalanganData = [
    { rw: "RW 1", diseases: [{ name: "Diabetes Melitus", count: 23, color: "bg-gradient-to-r from-orange-400 to-rose-500" }] },
    { rw: "RW 7", diseases: [{ name: "Diabetes Melitus", count: 0, color: "bg-gradient-to-r from-gray-300 to-gray-400" }] },
  ]

  const padangsariData = [
    { rw: "RW 2", diseases: [{ name: "Diabetes Melitus", count: 0, color: "bg-gradient-to-r from-gray-300 to-gray-400" }] },
    { rw: "RW 3", diseases: [{ name: "Diabetes Melitus", count: 2, color: "bg-gradient-to-r from-orange-400 to-rose-500" }] },
  ]

  const totalPedalangan = pedalanganData.reduce((sum, rw) => sum + rw.diseases.reduce((s, d) => s + d.count, 0), 0)
  const totalPadangsari = padangsariData.reduce((sum, rw) => sum + rw.diseases.reduce((s, d) => s + d.count, 0), 0)
  const totalAll = totalPedalangan + totalPadangsari

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with floating animation */}
        <header className="mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <MapPin className="h-8 w-8 text-white animate-pulse" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Lokasi Persebaran
              </h1>
              <p className="text-base md:text-lg text-gray-600 font-medium">Distribusi kasus Diabetes Melitus di Banyumanik</p>
            </div>
          </div>
        </header>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-0 transition-transform duration-700"></div>
            <div className="relative z-10">
              <Activity className="h-8 w-8 text-white/90 mb-3" />
              <p className="text-white/80 text-sm font-semibold mb-1">Pedalangan</p>
              <p className="text-3xl font-black text-white">{totalPedalangan}</p>
              <p className="text-white/70 text-xs mt-1">kasus terdaftar</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-0 transition-transform duration-700"></div>
            <div className="relative z-10">
              <Activity className="h-8 w-8 text-white/90 mb-3" />
              <p className="text-white/80 text-sm font-semibold mb-1">Padangsari</p>
              <p className="text-3xl font-black text-white">{totalPadangsari}</p>
              <p className="text-white/70 text-xs mt-1">kasus terdaftar</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-0 transition-transform duration-700"></div>
            <div className="relative z-10">
              <Activity className="h-8 w-8 text-white/90 mb-3" />
              <p className="text-white/80 text-sm font-semibold mb-1">Total Keseluruhan</p>
              <p className="text-3xl font-black text-white">{totalAll}</p>
              <p className="text-white/70 text-xs mt-1">kasus terdaftar</p>
            </div>
          </div>
        </div>

        {/* Map Card with glassmorphism */}
        <Card className="group relative overflow-hidden border-0 shadow-2xl rounded-3xl backdrop-blur-xl bg-white/80 hover:shadow-emerald-200/50 transition-all duration-700 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <CardHeader className="relative flex items-center justify-between gap-4 border-b border-gray-200/50 bg-gradient-to-r from-white/80 to-emerald-50/50 py-5 px-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-black bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent">
                  Peta Persebaran Wilayah
                </CardTitle>
                <p className="text-sm md:text-base text-gray-600 font-medium mt-1">Visualisasi geografis distribusi kasus</p>
              </div>
            </div>
            {/* <Badge className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 text-sm md:text-base px-5 py-2 shadow-lg font-bold hover:shadow-xl hover:scale-110 transition-all duration-300">
              Total: {totalAll} kasus
            </Badge> */}
          </CardHeader>
          <CardContent className="p-0 relative">
            <div className="w-full h-80 md:h-96 bg-white flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white"></div>
              <div className="text-center relative z-10 transform group-hover:scale-110 transition-transform duration-700">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                  <div className="relative w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white to-purple-50 shadow-2xl flex items-center justify-center border border-purple-200/50">
                    <MapPin className="h-10 w-10 text-purple-500" />
                  </div>
                </div>
                <p className="text-lg md:text-xl font-black text-gray-800 mb-2">Peta Interaktif</p>
                <p className="text-sm md:text-base text-gray-600 font-medium">Integrasi peta akan ditampilkan di sini</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Grid with enhanced hover effects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pedalangan */}
          <Card className="group relative overflow-hidden border-0 shadow-2xl rounded-3xl backdrop-blur-xl bg-white/90 hover:shadow-emerald-300/50 transition-all duration-700 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="relative flex items-center gap-4 border-b border-emerald-200/50 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 py-5 px-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-xl font-black bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  Pedalangan
                </CardTitle>
                <p className="text-sm text-gray-600 font-medium mt-1">Distribusi kasus per RW</p>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 relative">
              {pedalanganData.map((rw, idx) => (
                <div
                  key={rw.rw}
                  className="group/item relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-white to-emerald-50/60 border-2 border-emerald-200/50 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-500 hover:scale-105 cursor-pointer"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 transform -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-between mb-3">
                    <h3 className="font-black text-gray-900 text-lg">{rw.rw}</h3>
                    <div className="relative">
                      {rw.diseases[0].count > 0 ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-50 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative bg-gradient-to-r from-orange-500 to-rose-500 rounded-full p-2 shadow-lg">
                            <TrendingUp className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-200 rounded-full p-2">
                          <TrendingDown className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                  {rw.diseases.map((disease) => (
                    <div key={disease.name} className="relative flex items-center justify-between">
                      <span className="text-base text-gray-700 font-semibold">{disease.name}</span>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${disease.color} shadow-lg animate-pulse`} />
                        <Badge className={`px-4 py-1.5 text-sm font-black rounded-full shadow-lg transform group-hover/item:scale-110 transition-all duration-300 ${
                          disease.count > 0 
                            ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white border-0' 
                            : 'bg-gray-200 text-gray-700 border-0'
                        }`}>
                          {disease.count} orang
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Padangsari */}
          <Card className="group relative overflow-hidden border-0 shadow-2xl rounded-3xl backdrop-blur-xl bg-white/90 hover:shadow-purple-300/50 transition-all duration-700 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="relative flex items-center gap-4 border-b border-purple-200/50 bg-gradient-to-r from-purple-50/80 to-fuchsia-50/80 py-5 px-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-fuchsia-500 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-xl font-black bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">
                  Padangsari
                </CardTitle>
                <p className="text-sm text-gray-600 font-medium mt-1">Distribusi kasus per RW</p>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 relative">
              {padangsariData.map((rw, idx) => (
                <div
                  key={rw.rw}
                  className="group/item relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-white to-purple-50/60 border-2 border-purple-200/50 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 hover:scale-105 cursor-pointer"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 transform -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-between mb-3">
                    <h3 className="font-black text-gray-900 text-lg">{rw.rw}</h3>
                    <div className="relative">
                      {rw.diseases[0].count > 0 ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-50 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative bg-gradient-to-r from-orange-500 to-rose-500 rounded-full p-2 shadow-lg">
                            <TrendingUp className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-200 rounded-full p-2">
                          <TrendingDown className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                  {rw.diseases.map((disease) => (
                    <div key={disease.name} className="relative flex items-center justify-between">
                      <span className="text-base text-gray-700 font-semibold">{disease.name}</span>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${disease.color} shadow-lg animate-pulse`} />
                        <Badge className={`px-4 py-1.5 text-sm font-black rounded-full shadow-lg transform group-hover/item:scale-110 transition-all duration-300 ${
                          disease.count > 0 
                            ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white border-0' 
                            : 'bg-gray-200 text-gray-700 border-0'
                        }`}>
                          {disease.count} orang
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}