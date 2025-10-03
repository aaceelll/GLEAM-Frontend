"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Pin, Lock, Trash2, Users, Eye, Heart, Calendar, Shield } from "lucide-react"
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
      alert("Status pin berhasil diubah")
      loadThreads()
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengubah status pin")
    }
  }

  const handleLockThread = async (threadId: number) => {
    try {
      await api.post(`/admin/forum/threads/${threadId}/lock`)
      alert("Status lock berhasil diubah")
      loadThreads()
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengubah status lock")
    }
  }

  const handleDeleteThread = async (threadId: number, title: string) => {
    if (!confirm(`Hapus thread "${title}"?`)) return
    try {
      await api.delete(`/admin/forum/threads/${threadId}/force`)
      alert("Thread berhasil dihapus")
      loadThreads()
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menghapus thread")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent">
              Kelola Forum Komunitas
            </h1>
            <p className="text-gray-600 mt-0.5">Moderasi diskusi publik</p>
          </div>
        </div>

        {/* Info Box */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Akses Admin</p>
              <p className="text-sm text-blue-700">
                Anda hanya bisa melihat dan mengelola <strong>diskusi publik</strong>. Pertanyaan private tidak dapat
                diakses oleh admin.
              </p>
            </div>
          </div>
        </Card>

        {/* Stats with hover effect */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white border-none shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8" />
              <div>
                <p className="text-3xl font-bold">{threads.length}</p>
                <p className="text-emerald-100 text-sm">Total Diskusi</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-none shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <Pin className="w-8 h-8" />
              <div>
                <p className="text-3xl font-bold">{threads.filter((t) => t.is_pinned).length}</p>
                <p className="text-yellow-100 text-sm">Dipinned</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-500 to-pink-600 text-white border-none shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <Lock className="w-8 h-8" />
              <div>
                <p className="text-3xl font-bold">{threads.filter((t) => t.is_locked).length}</p>
                <p className="text-red-100 text-sm">Dikunci</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-none shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <div>
                <p className="text-3xl font-bold">234</p>
                <p className="text-teal-100 text-sm">Anggota Aktif</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-none shadow-xl bg-white rounded-3xl">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Filter Kategori</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => setSelectedCategory(null)}
                  variant={selectedCategory === null ? "default" : "ghost"}
                  className={`w-full justify-start rounded-xl ${
                    selectedCategory === null ? "bg-emerald-600 text-white shadow-md" : "hover:bg-emerald-50"
                  }`}
                >
                  Semua Kategori
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    variant={selectedCategory === cat.id ? "default" : "ghost"}
                    className={`w-full justify-start rounded-xl ${
                      selectedCategory === cat.id ? "bg-emerald-600 text-white shadow-md" : "hover:bg-emerald-50"
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    <span className="flex-1 text-left text-sm">{cat.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {cat.thread_count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Threads List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search */}
            <Card className="p-4 border-none shadow-lg bg-white rounded-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Cari diskusi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </Card>

            {/* Threads */}
            {loading ? (
              <Card className="p-12 text-center border-none shadow-lg rounded-3xl">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Memuat diskusi...</p>
              </Card>
            ) : threads.length === 0 ? (
              <Card className="p-12 text-center border-none shadow-lg rounded-3xl">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Tidak ada diskusi ditemukan</p>
              </Card>
            ) : (
              threads.map((thread) => (
                <Card
                  key={thread.id}
                  className="p-6 border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl border-l-4 border-emerald-500"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {thread.is_pinned && (
                            <Badge className="bg-yellow-500 text-white rounded-lg">
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
                          <Badge
                            style={{ backgroundColor: thread.category.color, color: "white" }}
                            className="rounded-lg"
                          >
                            {thread.category.icon} {thread.category.name}
                          </Badge>
                        </div>
                        <Link href={`/dashboard/admin/forum/${thread.id}`}>
                          <h3 className="font-bold text-lg text-gray-800 hover:text-emerald-600 transition-colors mb-2">
                            {thread.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{thread.content}</p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <strong>{thread.user.nama}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(thread.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {thread.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {thread.reply_count} balasan
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {thread.like_count}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePinThread(thread.id)}
                        className={`rounded-xl ${
                          thread.is_pinned
                            ? "bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                            : "hover:bg-yellow-50 hover:border-yellow-300"
                        }`}
                      >
                        <Pin className="w-4 h-4 mr-1" />
                        {thread.is_pinned ? "Unpin" : "Pin"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLockThread(thread.id)}
                        className={`rounded-xl ${
                          thread.is_locked
                            ? "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                            : "hover:bg-red-50 hover:border-red-300"
                        }`}
                      >
                        <Lock className="w-4 h-4 mr-1" />
                        {thread.is_locked ? "Unlock" : "Lock"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteThread(thread.id, thread.title)}
                        className="text-red-600 hover:bg-red-50 border-red-300 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Hapus
                      </Button>

                      <Link href={`/dashboard/admin/forum/${thread.id}`} className="ml-auto">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md">
                          Lihat Detail
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
