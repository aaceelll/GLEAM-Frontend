"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { MessageSquare, Search, Pin, Lock, Trash2, Users, Calendar, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

interface Category {
  id: number
  name: string
  icon: string
  color: string
  thread_count: number
}

interface Thread {
  id: number
  title: string
  content: string
  user: { id: number; nama: string }
  category: Category
  is_pinned: boolean
  is_locked: boolean
  is_private: boolean
  view_count: number
  reply_count: number
  like_count: number
  created_at: string
  last_activity_at: string
}

export default function AdminForumPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; title: string } | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])
  
  useEffect(() => {
    loadThreads()
  }, [selectedCategory, searchQuery])

  const loadCategories = async () => {
    try {
      const response = await api.get("/forum/categories")
      setCategories(response.data)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const loadThreads = async () => {
    setLoading(true)
    try {
      const params: any = { type: "public" }
      if (selectedCategory) params.category_id = selectedCategory
      if (searchQuery) params.search = searchQuery
      const response = await api.get("/forum/threads", { params })
      setThreads(response.data.data || [])
    } catch (error) {
      console.error("Error loading threads:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePinThread = async (threadId: number) => {
    try {
      await api.post(`/admin/forum/threads/${threadId}/pin`)
      toast.success("Status pin berhasil diubah", {
        description: "Thread berhasil diperbarui di daftar forum.",
      })
      loadThreads()
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengubah status pin")
    }
  }

  const handleLockThread = async (threadId: number) => {
    try {
      await api.post(`/admin/forum/threads/${threadId}/lock`)
      toast.success("Status lock berhasil diubah", {
        description: "Thread berhasil dikunci atau dibuka.",
      })
      loadThreads()
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengubah status lock")
    }
  }

  const handleDeleteThread = async (threadId: number) => {
    try {
      await api.delete(`/admin/forum/threads/${threadId}/force`)
      toast.success("Thread berhasil dihapus", {
        description: "Diskusi sudah dihapus secara permanen.",
      })
      loadThreads()
      setConfirmDelete(null)
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menghapus thread")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return "Baru saja"
    if (mins < 60) return `${mins} menit yang lalu`
    if (hours < 24) return `${hours} jam yang lalu`
    if (days < 7) return `${days} hari yang lalu`
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  }

  const greenGrad = "from-emerald-500 to-teal-500"
  const hoverCard =
    "group relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-white " +
    "transition-all duration-500 hover:border-emerald-400 " +
    "hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1 cursor-pointer"

        return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-9">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* ICON CHIP – versi responsif */}
            <div className="relative isolate shrink-0">
              <span
                aria-hidden
                className="absolute -inset-1.5 sm:-inset-2 rounded-2xl bg-gradient-to-br from-emerald-400/25 to-teal-500/25 blur-lg -z-10"
              />
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

             {/* Judul + subjudul */}
            <div>
              <h1 className="text-[22px] leading-[1.15] sm:text-3xl md:text-4xl font-bold text-gray-800">
                Kelola Forum Komunitas<br className="hidden sm:block" />
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-0.5">
                Moderasi diskusi publik
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-blue-900 mb-1">Akses Admin</p>
              <p className="text-sm text-blue-700">
                Anda hanya bisa melihat dan mengelola <strong>diskusi publik</strong>. Pertanyaan private tidak dapat
                diakses oleh admin.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Diskusi */}
          <Card className={hoverCard}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Diskusi</h3>
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <div className="text-5xl font-bold text-gray-900">{threads.length}</div>
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">
                  {loading ? "Memuat…" : "Terdata saat ini"}
                </span>
              </div>
            </div>
          </Card>

          {/* Dipin */}
          <Card className={hoverCard}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Dipin</h3>
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Pin className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <div className="text-5xl font-bold text-gray-900">
                  {threads.filter((t) => t.is_pinned).length}
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">
                  {loading ? "Memuat…" : "Aktif diprioritaskan"}
                </span>
              </div>
            </div>
          </Card>

          {/* Dikunci */}
          <Card className={hoverCard}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Dikunci</h3>
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Lock className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <div className="text-5xl font-bold text-gray-900">
                  {threads.filter((t) => t.is_locked).length}
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">
                  {loading ? "Memuat…" : "Tidak menerima balasan"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                  Daftar Diskusi
                </h2>
                <p className="text-sm text-gray-600 mt-1 ml-4">
                  {loading ? "Memuat…" : `${threads.length} diskusi tersedia`}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{threads.length} Diskusi</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <Input
                placeholder="Cari diskusi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-emerald-100"
              />
            </div>

            {/* Threads */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block relative">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4 font-medium">Memuat diskusi…</p>
              </div>
            ) : threads.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-inner">
                  <MessageSquare className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-700 font-bold text-lg mb-2">Tidak ada diskusi ditemukan</p>
                <p className="text-sm text-gray-500">Coba ubah kata kunci pencarian Anda</p>
              </div>
            ) : (
              <div className="space-y-6">
                {threads.map((thread, index) => (
                  <div
                    key={thread.id}
                    className="group relative bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Overlay gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${greenGrad} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${greenGrad} opacity-5 rounded-bl-full`} />

                    <div className="relative flex items-start gap-5">
                      {/* Badge nomor */}
                      <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${greenGrad} text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {thread.is_pinned && (
                            <Badge className="bg-amber-500 text-white rounded-lg">
                              <Pin className="w-3 h-3 mr-1" />
                              Pinned
                            </Badge>
                          )}
                          {thread.is_locked && (
                            <Badge className="bg-red-500 text-white rounded-lg">
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                          {thread.category && (
                            <Badge
                              style={{ backgroundColor: thread.category.color, color: "white" }}
                              className="rounded-lg"
                            >
                              {thread.category.icon} {thread.category.name}
                            </Badge>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-gray-900 text-xl group-hover:text-emerald-700 transition-colors break-words [word-break:break-word]">
                          {thread.title}
                        </h3>

                        {/* Content */}
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed break-words [word-break:break-word]">
                          {thread.content}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 flex-wrap text-xs text-gray-600 pt-2 border-t border-gray-100">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-emerald-600" />
                            <strong className="text-gray-900">{thread.user.nama}</strong>
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            {formatDate(thread.created_at)}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-medium">{thread.reply_count}</span> balasan
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-3 flex-wrap">
                          <button
                            onClick={() => handlePinThread(thread.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:scale-105 ${
                              thread.is_pinned
                                ? "bg-amber-100 text-amber-700 border-2 border-amber-300"
                                : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-amber-50 hover:border-amber-300"
                            }`}
                          >
                            <Pin className="w-4 h-4 inline mr-1" />
                            {thread.is_pinned ? "Unpin" : "Pin"}
                          </button>

                          <button
                            onClick={() => handleLockThread(thread.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:scale-105 ${
                              thread.is_locked
                                ? "bg-red-100 text-red-700 border-2 border-red-300"
                                : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                            }`}
                          >
                            <Lock className="w-4 h-4 inline mr-1" />
                            {thread.is_locked ? "Unlock" : "Lock"}
                          </button>

                          <button
                            onClick={() => setConfirmDelete({ id: thread.id, title: thread.title })}
                            className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-red-600 border-2 border-gray-200 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm hover:shadow-md hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" />
                            Hapus
                          </button>

                          <Link href={`/dashboard/admin/forum/${thread.id}`} className="ml-auto">
                            <button className={`px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${greenGrad} text-white shadow-md hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2`}>
                              Lihat Detail
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center py-6">
          <p className="text-sm text-gray-500">
            💡 Tip: Pin diskusi penting agar selalu muncul di atas, dan kunci diskusi untuk mencegah balasan baru
          </p>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border-2 border-gray-100 shadow-2xl">
            <div className="px-5 py-4 border-b-2 border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 grid place-items-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Hapus Diskusi?</h3>
            </div>

            <div className="px-5 py-4 space-y-1.5">
              <p className="text-sm text-gray-700">
                Apakah Anda yakin ingin benar-benar menghapus{" "}
                <span className="font-semibold">"{confirmDelete.title}"</span>?
              </p>
              <p className="text-xs text-gray-500">Tindakan ini tidak dapat dibatalkan.</p>
            </div>

            <div className="px-5 py-4 flex items-center justify-end gap-3 border-t-2 border-gray-100">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl border-2 border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteThread(confirmDelete.id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-rose-700 hover:shadow-lg transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}