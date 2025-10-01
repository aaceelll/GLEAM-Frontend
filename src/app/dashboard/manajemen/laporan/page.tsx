"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileText, Search, Eye, Trash2, Download, SlidersHorizontal, TrendingUp, BarChart3 } from "lucide-react"

type Row = { id: number | string; name: string; date: string; score: number }
type TabKey = "dsmq" | "pretest" | "posttest"

export default function LaporanKeseluruhan() {
  const [searchQuery, setSearchQuery] = useState("")
  const [active, setActive] = useState<TabKey>("dsmq")

  // dummy data
  const data = {
    dsmq: [
      { id: 1, name: "test", date: "Sabtu, 6 September 2025, 23:58", score: 85 },
      { id: 2, name: "testing", date: "Senin, 25 Agustus 2025, 19:30", score: 72 },
      { id: 3, name: "testing", date: "Selasa, 19 Agustus 2025, 22:55", score: 68 },
      { id: 4, name: "testing", date: "Minggu, 17 Agustus 2025, 02:23", score: 91 },
      { id: 5, name: "bagus", date: "Sabtu, 16 Agustus 2025, 11:15", score: 78 },
    ] as Row[],
    pretest: [
      { id: 1, name: "Test", date: "Minggu, 07 September 2025, 00:14", score: 50 },
      { id: 2, name: "Ahmad", date: "Sabtu, 06 September 2025, 15:30", score: 65 },
      { id: 3, name: "Budi", date: "Jumat, 05 September 2025, 10:20", score: 72 },
    ] as Row[],
    posttest: [
      { id: 1, name: "Test", date: "Minggu, 07 September 2025, 01:30", score: 85 },
      { id: 2, name: "Ahmad", date: "Sabtu, 06 September 2025, 16:45", score: 88 },
    ] as Row[],
  }

  const tabs: { key: TabKey; label: string; gradient: string; icon: string }[] = [
    { key: "dsmq", label: "DSMQ", gradient: "from-emerald-500 to-teal-500", icon: "📊" },
    { key: "pretest", label: "Pre Test", gradient: "from-blue-500 to-cyan-500", icon: "📝" },
    { key: "posttest", label: "Post Test", gradient: "from-violet-500 to-fuchsia-500", icon: "✅" },
  ]

  const q = searchQuery.trim().toLowerCase()
  const rows = useMemo(() => {
    const arr = data[active]
    return q ? arr.filter((r) => r.name.toLowerCase().includes(q)) : arr
  }, [q, active])

  const totals = {
    dsmq: data.dsmq.length,
    pretest: data.pretest.length,
    posttest: data.posttest.length,
  }

  const avgScore = rows.length > 0 ? Math.round(rows.reduce((sum, r) => sum + r.score, 0) / rows.length) : 0

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <FileText className="h-8 w-8 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Laporan Keseluruhan
              </h1>
              <p className="text-base md:text-lg text-gray-600 mt-1 font-medium">Ringkasan hasil screening & tes</p>
            </div>
          </div>
          <Button className="group relative overflow-hidden rounded-2xl px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white shadow-2xl hover:shadow-gray-900/50 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-2">
              <Download className="h-5 w-5 transform group-hover:translate-y-1 transition-transform duration-300" />
              <span className="font-bold">Ekspor Data</span>
            </div>
          </Button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-6 shadow-xl hover:shadow-2xl hover:shadow-emerald-300/50 transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-0 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <BarChart3 className="h-9 w-9 text-white/90" />
                <span className="text-3xl">📊</span>
              </div>
              <p className="text-white/80 text-sm font-bold mb-1">Total DSMQ</p>
              <p className="text-4xl font-black text-white mb-1">{totals.dsmq}</p>
              <p className="text-white/70 text-xs">responden terdaftar</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-300/50 transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-0 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <FileText className="h-9 w-9 text-white/90" />
                <span className="text-3xl">📝</span>
              </div>
              <p className="text-white/80 text-sm font-bold mb-1">Total Pre Test</p>
              <p className="text-4xl font-black text-white mb-1">{totals.pretest}</p>
              <p className="text-white/70 text-xs">peserta mengikuti</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-300/50 transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-0 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="h-9 w-9 text-white/90" />
                <span className="text-3xl">✅</span>
              </div>
              <p className="text-white/80 text-sm font-bold mb-1">Total Post Test</p>
              <p className="text-4xl font-black text-white mb-1">{totals.posttest}</p>
              <p className="text-white/70 text-xs">peserta menyelesaikan</p>
            </div>
          </div>
        </div>

        {/* Tabs with enhanced design */}
        <div className="relative rounded-3xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-xl p-3">
          <div className="relative grid grid-cols-3 gap-3">
            {tabs.map((t) => {
              const activeTab = active === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`group relative flex items-center justify-center gap-2 rounded-2xl px-5 py-4 transition-all duration-500 ${
                    activeTab
                      ? "text-white shadow-2xl transform scale-105"
                      : "text-gray-700 hover:bg-gray-100 hover:scale-105"
                  }`}
                >
                  {activeTab && (
                    <>
                      <span className={`absolute inset-0 rounded-2xl -z-10 bg-gradient-to-r ${t.gradient} shadow-2xl`} />
                      <div className="absolute inset-0 bg-white/20 rounded-2xl -z-10 transform group-hover:scale-110 transition-transform duration-500"></div>
                    </>
                  )}
                  <span className="text-2xl transform group-hover:scale-125 transition-transform duration-300">{t.icon}</span>
                  <span className="text-sm md:text-base font-black">{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Table Card */}
        <Card className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.01] bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <CardContent className="p-0 relative">
            {/* Toolbar */}
            <div className="p-5 md:p-6 border-b-2 border-gray-200 bg-gradient-to-r from-white to-gray-50 flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative flex-1 max-w-xl group/search">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover/search:text-blue-500 transition-colors duration-300" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Cari nama di ${tabs.find(t=>t.key===active)?.label}…`}
                  className="pl-12 h-12 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 font-medium"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-50 backdrop-blur-sm">
                    {["No", "Nama", "Tanggal", "Skor", "Aksi"].map((h, i) => (
                      <th
                        key={i}
                        className={`text-left text-xs md:text-sm font-black text-gray-800 uppercase tracking-wider py-5 border-b-2 border-gray-200 ${
                          i === 0 ? "pl-6" : i === 4 ? "pr-6 text-right" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center text-gray-400">
                          <div className="relative mb-4">
                            <div className="absolute inset-0 bg-gray-300 rounded-full blur-xl opacity-30"></div>
                            <FileText className="relative h-16 w-16 text-gray-300" />
                          </div>
                          <span className="font-bold text-lg">Tidak ada data ditemukan</span>
                          <span className="text-sm mt-1">Coba ubah filter pencarian</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, i) => (
                      <tr
                        key={r.id}
                        className="group/row border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer"
                      >
                        <td className="py-5 pl-6 font-bold text-gray-900">
                          {i + 1}
                        </td>
                        <td className="py-5 font-bold text-gray-900 group-hover/row:text-blue-700 transition-colors duration-300">{r.name}</td>
                        <td className="py-5 text-sm text-gray-600 font-medium">{r.date}</td>
                        <td className="py-5">
                          <ScoreChip value={r.score} />
                        </td>
                        <td className="py-5 pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <IconButton title="Detail" onClick={() => {}}>
                              <Eye className="h-4 w-4" />
                            </IconButton>
                            <IconButton title="Hapus" tone="danger" onClick={() => {}}>
                              <Trash2 className="h-4 w-4" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ===== Subcomponents ===== */

function ScoreChip({ value }: { value: number }) {
  const config =
    value >= 80 
      ? { gradient: "from-emerald-500 to-teal-600", text: "text-white", shadow: "shadow-emerald-300/50" }
      : value >= 60 
      ? { gradient: "from-amber-500 to-orange-600", text: "text-white", shadow: "shadow-amber-300/50" }
      : { gradient: "from-red-500 to-rose-600", text: "text-white", shadow: "shadow-red-300/50" }
  
  return (
    <div className="group/chip relative inline-block">
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-full blur-md opacity-40 group-hover/chip:opacity-70 transition-opacity duration-300`}></div>
      <span className={`relative inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r ${config.gradient} ${config.text} text-sm font-black shadow-lg ${config.shadow} transform group-hover/chip:scale-110 transition-all duration-300`}>
        {value}
      </span>
    </div>
  )
}

function IconButton({
  children,
  onClick,
  title,
  tone = "neutral",
}: {
  children: React.ReactNode
  onClick: () => void
  title?: string
  tone?: "neutral" | "danger"
}) {
  const config = tone === "danger"
    ? "group/btn p-2.5 rounded-xl border-2 text-red-600 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-600 hover:text-white border-red-200 hover:border-red-500 shadow-lg hover:shadow-red-300/50"
    : "group/btn p-2.5 rounded-xl border-2 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white border-blue-200 hover:border-blue-500 shadow-lg hover:shadow-blue-300/50"
  
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`${config} transition-all duration-300 transform hover:scale-110 hover:rotate-6`}
    >
      <div className="transform group-hover/btn:scale-110 transition-transform duration-300">
        {children}
      </div>
    </button>
  )
}