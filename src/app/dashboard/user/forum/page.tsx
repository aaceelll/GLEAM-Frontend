// app/(dashboard)/dashboard/user/forum/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Search,
  Plus,
  Heart,
  Pin,
  Users,
  Calendar,
  Lock,
  Shield,
  Stethoscope,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

/* ================= Types ================= */
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
  user: { id: number; nama: string };
  category: Category | null;
  assigned_nakes: { id: number; nama: string } | null;
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

/* ================= Page ================= */
export default function ForumPage() {
  const [publicThreads, setPublicThreads] = useState<Thread[]>([]);
  const [privateThreads, setPrivateThreads] = useState<Thread[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"public" | "private">("public");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreads();
  }, [activeTab, searchQuery]);

  const loadThreads = async () => {
    setLoading(true);
    try {
      const params: any = { type: activeTab };
      if (searchQuery) params.search = searchQuery;
      const response = await api.get("/forum/threads", { params });
      if (activeTab === "public") {
        setPublicThreads(response.data.data || []);
      } else {
        setPrivateThreads(response.data.data || []);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const currentThreads = activeTab === "public" ? publicThreads : privateThreads;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto lg:ml-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black-800">Forum Komunitas</h1>
              <p className="text-gray-600 mt-0.5">Ruang berbagi & tanya jawab seputar diabetes</p>
            </div>
          </div>
          <Button onClick={() => setShowNewThreadModal(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Buat Pertanyaan
          </Button>
        </div>

        {/* Card Diskusi — container tanpa hover */}
        <Card className="p-6 rounded-3xl bg-white border border-emerald-300/70">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "public" | "private")}>
            {/* Tabs + Search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <TabsList className="grid grid-cols-2 w-fit rounded-xl bg-emerald-50 p-1 border border-emerald-100">
                <TabsTrigger
                  value="public"
                  className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 data-[state=active]:border data-[state=active]:border-emerald-200"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Publik
                </TabsTrigger>
                <TabsTrigger
                  value="private"
                  className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 data-[state=active]:border data-[state=active]:border-emerald-200"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Private
                </TabsTrigger>
              </TabsList>

              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <Input
                  placeholder={`Cari ${activeTab === "public" ? "diskusi" : "pertanyaan"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Content */}
            <div className="mt-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-emerald-700/70">Memuat...</p>
                </div>
              ) : currentThreads.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 mb-4">
                    <MessageSquare className="h-9 w-9 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-900 mb-1">
                    Belum ada {activeTab === "public" ? "diskusi" : "pertanyaan"}
                  </h3>
                  <p className="text-emerald-700/70 mb-4 text-sm">
                    {activeTab === "public" ? "Jadilah yang pertama memulai diskusi!" : "Ajukan pertanyaan private ke tenaga kesehatan."}
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {currentThreads.map((thread) => (
                    <ThreadCard key={thread.id} thread={thread} formatDate={formatDate} />
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </Card>

        {/* Card Info Penting — container tanpa hover */}
        <Card className="p-6 rounded-3xl bg-emerald-50/40 border border-emerald-300/70">
          <h3 className="font-semibold text-base mb-4 text-emerald-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-700" />
            Info Penting
          </h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-emerald-200 bg-white p-4">
              <p className="font-medium text-emerald-900 mb-1">💬 Publik</p>
              <p className="text-emerald-800/90">Diskusi terlihat oleh semua pengguna & bisa mendapat banyak masukan.</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-4">
              <p className="font-medium text-emerald-900 mb-1">🔒 Private</p>
              <p className="text-emerald-800/90">Hanya Anda & tenaga kesehatan yang dapat melihat dan menjawab.</p>
            </div>
          </div>
        </Card>
      </div>

      {showNewThreadModal && (
        <NewThreadModal
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

/* ================= Components ================= */
function ThreadCard({
  thread,
  formatDate,
}: {
  thread: Thread;
  formatDate: (date: string) => string;
}) {
  const getStatusBadge = () => {
    if (!thread.is_private) return null;
    if (thread.assigned_nakes) {
      return (
        <Badge className="bg-emerald-600 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />
          Dijawab
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-500 text-white">
        <Clock className="w-3 h-3 mr-1" />
        Menunggu
      </Badge>
    );
  };

  return (
    <Link href={`/dashboard/user/forum/${thread.id}`}>
      {/* Desain & hover meniru "Daftar Konten" #3 */}
      <Card
        className="
          group relative bg-white border-2 border-gray-100 rounded-3xl p-6
          hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden
        "
      >
        {/* overlay gradient lembut */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        {/* bubble pojok kanan atas */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-5 rounded-bl-full" />

        <div className="relative flex items-start gap-5">
          {/* icon box gradient (scale saat hover) */}
          <div
            className="
              flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl
              bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold shadow
              group-hover:scale-110 transition-transform duration-300
            "
          >
            {thread.is_private ? (
              <Shield className="w-5 h-5" />
            ) : (
              thread.user.nama.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {getStatusBadge()}
                  {thread.is_pinned && (
                    <Badge className="bg-emerald-600/90 text-white">
                      <Pin className="w-3 h-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                  {thread.is_locked && (
                    <Badge className="bg-red-600 text-white">
                      <Lock className="w-3 h-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-emerald-700 transition-colors">
                  {thread.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {thread.content}
                </p>
              </div>
            </div>

            {/* meta */}
            <div className="flex items-center gap-3 flex-wrap mt-3 mb-2 text-xs text-gray-600">
              <span>
                oleh <strong className="text-gray-900">{thread.user.nama}</strong>
              </span>
              {thread.assigned_nakes && (
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  <strong>{thread.assigned_nakes.nama}</strong>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(thread.last_activity_at || thread.created_at)}
              </span>
            </div>

            {/* stats */}
            <div className="flex items-center gap-6 text-sm text-gray-700">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium">{thread.reply_count}</span> balasan
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

/* ============ Modal (no category needed) ============ */
function NewThreadModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({ title: "", content: "", is_private: false });
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = formData.title.trim().length > 0 && formData.content.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await api.post("/forum/threads", {
        title: formData.title,
        content: formData.content,
        is_private: formData.is_private,
      });
      alert(formData.is_private ? "Pertanyaan private berhasil dikirim! 🩺" : "Diskusi berhasil dibuat! 🎉");
      onSuccess();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal membuat thread");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl">
        <Card className="rounded-3xl overflow-hidden border border-emerald-200 bg-white">
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-emerald-900">Buat Pertanyaan Baru</h2>
              <p className="text-emerald-800/70 text-sm">
                {formData.is_private ? "🔒 Hanya Anda & tenaga kesehatan yang dapat melihat" : "💬 Terbuka untuk semua pengguna"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="p-4 rounded-2xl border border-emerald-200 bg-white">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_private}
                    onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
                    className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-400"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-emerald-900">Jadikan Pertanyaan Private</span>
                    <p className="text-xs text-emerald-800/80">
                      {formData.is_private
                        ? "Hanya Anda & tenaga kesehatan yang bisa melihat & menjawab."
                        : "Semua orang bisa melihat, mengomentari, dan memberi dukungan."}
                    </p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-2">
                  Judul {formData.is_private ? "Pertanyaan" : "Diskusi"} <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder={formData.is_private ? "Contoh: Cara menurunkan gula darah dengan cepat" : "Tulis judul yang jelas dan deskriptif..."}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-11 rounded-xl border-2 border-emerald-200 focus:border-emerald-300 focus:ring-emerald-100"
                  maxLength={255}
                  required
                />
                <p className="text-xs text-emerald-800/70 mt-1">{formData.title.length}/255 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-2">
                  {formData.is_private ? "Detail Pertanyaan" : "Konten"} <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder={
                    formData.is_private
                      ? "Jelaskan pertanyaan Anda secara detail. Semakin detail, semakin akurat jawabannya..."
                      : "Bagikan cerita, pertanyaan, atau tips Anda di sini..."
                  }
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="rounded-xl border-2 border-emerald-200 focus:border-emerald-300 focus:ring-emerald-100 resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting || !canSubmit} className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                  {submitting ? "Mengirim..." : formData.is_private ? "Kirim Private" : "Posting Diskusi"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="px-6 h-11 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                  disabled={submitting}
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
