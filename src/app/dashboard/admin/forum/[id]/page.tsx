"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Pin,
  Lock,
  Trash2,
  Calendar,
  Eye,
  MessageSquare,
  Heart,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface User { id: number; nama: string }
interface Category { id: number; name: string; icon: string; color: string }
interface Reply { id: number; content: string; user: User; like_count: number; created_at: string }
interface Thread {
  id: number; title: string; content: string; user: User; category: Category;
  is_pinned: boolean; is_locked: boolean; is_private: boolean;
  view_count: number; reply_count: number; like_count: number;
  created_at: string; replies: Reply[];
}

export default function AdminForumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = params.id as string;

  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);

  const hoverCard =
    "group relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-white " +
    "transition-all duration-500 hover:border-emerald-400 " +
    "hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)]";

  useEffect(() => { loadThread(); }, [threadId]);

  const loadThread = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/forum/threads/${threadId}`);
      if (response.data.is_private) {
        alert("Admin tidak memiliki akses ke pertanyaan private");
        router.push("/dashboard/admin/forum");
        return;
      }
      setThread(response.data);
    } catch (error: any) {
      console.error("Error loading thread:", error);
      alert("Thread tidak ditemukan");
      router.push("/dashboard/admin/forum");
    } finally {
      setLoading(false);
    }
  };

  // (opsi) fungsionalitas admin masih ada tapi tombol2nya tidak ditampilkan:
  const handlePinThread = async () => {
    try { await api.post(`/admin/forum/threads/${threadId}/pin`); loadThread(); }
    catch (e:any) { alert(e.response?.data?.message || "Gagal mengubah status pin"); }
  };
  const handleLockThread = async () => {
    try { await api.post(`/admin/forum/threads/${threadId}/lock`); loadThread(); }
    catch (e:any) { alert(e.response?.data?.message || "Gagal mengubah status lock"); }
  };
  const handleDeleteThread = async () => {
    if (!confirm("Hapus thread ini? Tindakan ini tidak dapat dibatalkan!")) return;
    try { await api.delete(`/admin/forum/threads/${threadId}/force`); router.push("/dashboard/admin/forum"); }
    catch (e:any) { alert(e.response?.data?.message || "Gagal menghapus thread"); }
  };
  const handleDeleteReply = async (replyId: number) => {
    if (!confirm("Hapus balasan ini?")) return;
    try { await api.delete(`/forum/replies/${replyId}`); loadThread(); }
    catch (e:any) { alert(e.response?.data?.message || "Gagal menghapus balasan"); }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };
  const k = (n: number) => n >= 1000 ? `${(n/1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`;

  const statusChips = useMemo(() => {
    if (!thread) return null;
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          style={{ backgroundColor: thread.category.color, color: "white" }}
          className="rounded-lg shadow"
        >
          {thread.category.icon} {thread.category.name}
        </Badge>
        {thread.is_pinned && (
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg">
            <Pin className="w-3 h-3 mr-1" /> Pinned
          </Badge>
        )}
        {thread.is_locked && (
          <Badge className="bg-rose-100 text-rose-800 border border-rose-300 rounded-lg">
            <Lock className="w-3 h-3 mr-1" /> Locked
          </Badge>
        )}
      </div>
    );
  }, [thread]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Memuat diskusi…</p>
        </div>
      </div>
    );
  }
  if (!thread) return null;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Kembali */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/admin/forum">
            <Button variant="ghost" className="hover:bg-emerald-50 text-emerald-700 font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Forum
            </Button>
          </Link>
          {/* Toolbar dihapus sesuai permintaan (Pin/Lock/Hapus) */}
        </div>

        {/* ======= Satu Card: Judul + Meta + Stats + Konten (pertanyaan) ======= */}
        <Card className={`${hoverCard} p-0`}>
          {/* soft gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-100" />
          <div className="relative p-6 md:p-8">
            {/* header */}
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0 space-y-3">
                {statusChips}
                {/* Judul (font berbeda, lebih tebal & besar) */}
                <h1 className="text-[32px] md:text-[40px] leading-tight font-extrabold tracking-tight text-gray-900">
                  {thread.title}
                </h1>

                {/* Author + tanggal */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/90 text-white font-bold grid place-items-center shadow">
                      {thread.user.nama.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-900">{thread.user.nama}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    {formatDate(thread.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* divider tipis */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-100 to-transparent my-6" />

            {/* Konten pertanyaan (font berbeda: lebih kecil, body copy) */}
            <div className="rounded-2xl border-2 border-emerald-100 bg-white/70 p-5">
              <p className="text-[15px] md:text-base leading-7 text-gray-800 whitespace-pre-wrap">
                {thread.content}
              </p>
            </div>
          </div>
        </Card>

        {/* ======= Balasan ======= */}
        <Card className="rounded-2xl border-2 border-gray-100 bg-white p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 grid place-items-center shadow">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {thread.reply_count} Balasan
            </h2>
          </div>

          {thread.replies.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-inner">
                <MessageSquare className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-800 font-semibold">Belum ada balasan</p>
              <p className="text-sm text-gray-500">Balasan dari pengguna akan tampil di sini</p>
            </div>
          ) : (
            <ol className="relative ml-1">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-200 to-transparent" />
              <div className="space-y-5">
                {thread.replies.map((reply) => (
                  <li key={reply.id} className="pl-12">
                    <div className="group relative bg-white rounded-2xl border-2 border-gray-100 p-5 hover:border-emerald-200 hover:shadow-[0_10px_30px_rgba(16,185,129,0.08)] transition-all">
                      <div className="absolute -left-1.5 top-6 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-bold grid place-items-center shadow">
                            {reply.user.nama.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">{reply.user.nama}</p>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Member
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{formatDate(reply.created_at)}</p>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50">
                                <Heart className="w-4 h-4 text-emerald-600" />
                                <span className="font-medium">{reply.like_count}</span>
                              </div>
                              {/* tombol hapus tetap ada (opsional). Hapus jika tidak diperlukan */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteReply(reply.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Hapus balasan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3 text-gray-800 whitespace-pre-wrap leading-7">
                            {reply.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </div>
            </ol>
          )}
        </Card>
      </div>
    </div>
  );
}
