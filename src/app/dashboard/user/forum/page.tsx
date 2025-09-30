"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Search,
  Plus,
  Heart,
  Eye,
  Pin,
  TrendingUp,
  Users,
  Calendar,
  Send,
  Lock,
  Shield,
  Stethoscope,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  thread_count: number;
}

interface Thread {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    nama: string;
  };
  category: Category;
  assigned_nakes: {
    id: number;
    nama: string;
  } | null;
  is_pinned: boolean;
  is_locked: boolean;
  is_liked: boolean;
  is_private: boolean;
  view_count: number;
  reply_count: number;
  like_count: number;
  created_at: string;
  last_activity_at: string;
}

export default function ForumPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [publicThreads, setPublicThreads] = useState<Thread[]>([]);
  const [privateThreads, setPrivateThreads] = useState<Thread[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"public" | "private">("public");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadThreads();
  }, [activeTab, selectedCategory, searchQuery]);

  const loadCategories = async () => {
    try {
      const response = await api.get("/forum/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadThreads = async () => {
    setLoading(true);
    try {
      const params: any = {
        type: activeTab,
      };
      if (selectedCategory) params.category_id = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const response = await api.get("/forum/threads", { params });
      
      if (activeTab === "public") {
        setPublicThreads(response.data.data || []);
      } else {
        setPrivateThreads(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading threads:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const currentThreads = activeTab === "public" ? publicThreads : privateThreads;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Users className="w-10 h-10" />
                Forum Komunitas GLEAM
              </h1>
              <p className="text-emerald-100 text-lg">
                Berbagi pengalaman & tanya jawab seputar diabetes 💚
              </p>
            </div>
            <Button
              onClick={() => setShowNewThreadModal(true)}
              className="bg-white text-emerald-600 hover:bg-emerald-50 h-12 px-6 text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5 mr-2" />
              Buat Pertanyaan
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">{publicThreads.length}</p>
                <p className="text-emerald-100 text-sm">Diskusi Publik</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">{privateThreads.length}</p>
                <p className="text-teal-100 text-sm">Pertanyaan Private</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">234</p>
                <p className="text-green-100 text-sm">Anggota Aktif</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-lime-500 to-green-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">1.2k</p>
                <p className="text-lime-100 text-sm">Total Dukungan</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border-none shadow-xl bg-white">
              <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📂</span>
                Kategori
              </h3>
              <div className="space-y-2">
                <Button
                  onClick={() => setSelectedCategory(null)}
                  variant={selectedCategory === null ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    selectedCategory === null
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "hover:bg-emerald-50"
                  }`}
                >
                  <span className="mr-2">🌐</span>
                  <span className="flex-1 text-left">Semua Kategori</span>
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      selectedCategory === category.id
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "hover:bg-emerald-50"
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span className="flex-1 text-left text-sm">{category.name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.thread_count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Info Box */}
            <Card className="p-6 border-none shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Info Penting
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-semibold text-emerald-700 mb-1">💬 Publik</p>
                  <p className="text-xs">Diskusi bisa dilihat semua orang & mendapat banyak masukan</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-semibold text-teal-700 mb-1">🔒 Private</p>
                  <p className="text-xs">Hanya Anda & tenaga kesehatan yang bisa lihat & jawab</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Threads List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Tabs */}
            <Card className="p-6 border-none shadow-xl bg-white">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "public" | "private")}>
                <TabsList className="grid w-full grid-cols-2 bg-emerald-100 h-12">
                  <TabsTrigger
                    value="public"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-semibold"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Diskusi Publik
                  </TabsTrigger>
                  <TabsTrigger
                    value="private"
                    className="data-[state=active]:bg-teal-600 data-[state=active]:text-white font-semibold"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Pertanyaan Private
                  </TabsTrigger>
                </TabsList>

                {/* Search Bar */}
                <div className="mt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder={`Cari ${activeTab === "public" ? "diskusi" : "pertanyaan"}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="mt-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-500">Memuat...</p>
                    </div>
                  ) : currentThreads.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">
                        {activeTab === "public" ? "💬" : "🔒"}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Belum ada {activeTab === "public" ? "diskusi" : "pertanyaan"}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {activeTab === "public" 
                          ? "Jadilah yang pertama memulai diskusi!" 
                          : "Ajukan pertanyaan private ke tenaga kesehatan"}
                      </p>
                      <Button
                        onClick={() => setShowNewThreadModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Buat {activeTab === "public" ? "Diskusi" : "Pertanyaan"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentThreads.map((thread) => (
                        <ThreadCard key={thread.id} thread={thread} formatDate={formatDate} />
                      ))}
                    </div>
                  )}
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <NewThreadModal
          categories={categories}
          onClose={() => setShowNewThreadModal(false)}
          onSuccess={() => {
            setShowNewThreadModal(false);
            loadThreads();
          }}
        />
      )}
    </div>
  );
}

// Thread Card Component
function ThreadCard({ thread, formatDate }: { thread: Thread; formatDate: (date: string) => string }) {
  const getStatusBadge = () => {
    if (!thread.is_private) return null;
    
    if (thread.assigned_nakes) {
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />
          Dijawab
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-yellow-500 text-white">
        <Clock className="w-3 h-3 mr-1" />
        Menunggu
      </Badge>
    );
  };

  return (
    <Link href={`/dashboard/user/forum/${thread.id}`}>
      <Card className={`p-6 border-none shadow-lg hover:shadow-2xl transition-all cursor-pointer bg-white hover:scale-[1.01] ${
        thread.is_private ? "border-l-4 border-teal-500" : "border-l-4 border-emerald-500"
      }`}>
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className={`w-14 h-14 bg-gradient-to-br ${
              thread.is_private ? "from-teal-500 to-cyan-500" : "from-emerald-500 to-green-500"
            } rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
              {thread.is_private ? <Shield className="w-7 h-7" /> : thread.user.nama.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {thread.is_private && (
                    <Badge className="bg-teal-600 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      Private
                    </Badge>
                  )}
                  {getStatusBadge()}
                  {thread.is_pinned && (
                    <Badge className="bg-yellow-500 text-white">
                      <Pin className="w-3 h-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                  {thread.is_locked && (
                    <Badge className="bg-red-500 text-white">
                      <Lock className="w-3 h-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                  <h3 className="font-bold text-lg text-gray-800 hover:text-emerald-600 transition-colors">
                    {thread.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {thread.content}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap mb-3">
              <Badge
                style={{
                  backgroundColor: thread.category.color,
                  color: "white",
                }}
                className="shadow-sm"
              >
                {thread.category.icon} {thread.category.name}
              </Badge>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <span className="font-semibold">oleh</span>{" "}
                <strong className="text-emerald-600">{thread.user.nama}</strong>
              </span>
              {thread.assigned_nakes && (
                <span className="text-xs text-teal-600 flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  <strong>{thread.assigned_nakes.nama}</strong>
                </span>
              )}
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(thread.last_activity_at || thread.created_at)}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
                <Eye className="w-4 h-4" />
                <span className="font-medium">{thread.view_count}</span>
              </span>
              <span className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium">{thread.reply_count}</span> balasan
              </span>
              {!thread.is_private && (
                <span
                  className={`flex items-center gap-1.5 transition-colors ${
                    thread.is_liked ? "text-red-500" : "hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${thread.is_liked ? "fill-current" : ""}`} />
                  <span className="font-medium">{thread.like_count}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Modal Component
function NewThreadModal({ categories, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    content: "",
    is_private: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/forum/threads", formData);
      alert(formData.is_private ? "Pertanyaan private berhasil dikirim! 🩺" : "Diskusi berhasil dibuat! 🎉");
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal membuat thread");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl p-8 border-none shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Buat Pertanyaan Baru</h2>
        </div>

        {/* Privacy Toggle */}
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_private}
              onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                <span className="font-semibold text-gray-800">
                  Jadikan Pertanyaan Private
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {formData.is_private 
                  ? "🔒 Hanya Anda dan tenaga kesehatan yang bisa lihat & jawab"
                  : "💬 Semua orang bisa lihat, komentar, dan memberi dukungan"}
              </p>
            </div>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
            >
              <option value="">Pilih kategori...</option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Judul {formData.is_private ? "Pertanyaan" : "Diskusi"} <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder={formData.is_private 
                ? "Contoh: Cara menurunkan gula darah dengan cepat"
                : "Tulis judul yang menarik dan deskriptif..."}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-12 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
              maxLength={255}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/255 karakter</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {formData.is_private ? "Detail Pertanyaan" : "Konten"} <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder={formData.is_private
                ? "Jelaskan pertanyaan Anda secara detail. Semakin detail, jawaban akan semakin akurat..."
                : "Bagikan cerita, pertanyaan, atau tips Anda di sini..."}
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className={`flex-1 ${
                formData.is_private 
                  ? "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                  : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              } h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {formData.is_private ? "Kirim Pertanyaan Private" : "Posting Diskusi"}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-8 h-12 border-gray-300 hover:bg-gray-50"
              disabled={submitting}
            >
              Batal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}