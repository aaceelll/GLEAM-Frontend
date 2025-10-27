// app/(dashboard)/dashboard/admin/forum/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Lock,
  MessageSquare,
  Pin,
  ShieldAlert,
  X,
} from "lucide-react";

/* ===== Types ===== */
interface User { id: number; nama: string }
interface Category { id: number; name: string; icon: string; color: string }
interface Reply { id: number; content: string; user: User; created_at: string }
interface Thread {
  id: number;
  title: string;
  content: string;
  user: User;
  category: Category;
  is_pinned: boolean;
  is_locked: boolean;
  is_private: boolean;
  view_count: number;
  reply_count: number;
  like_count: number;
  created_at: string;
  replies: Reply[];
}

export default function AdminForumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const threadId = id;

  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);

  // UI states
  const [confirmOpen, setConfirmOpen] = useState<null | number>(null); // replyId
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const hoverCard =
    "group relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-white " +
    "transition-all duration-500 hover:border-emerald-400 " +
    "hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)]";

  useEffect(() => { loadThread(); }, [threadId]);

  async function loadThread() {
    setLoading(true);
    try {
      const res = await api.get(`/forum/threads/${threadId}`);
      const data: Thread = res.data;
      if (data.is_private) {
        alert("Admin tidak memiliki akses ke pertanyaan private");
        router.push("/dashboard/admin/forum");
        return;
      }
      setThread(data);
    } catch (e: any) {
      console.error(e);
      alert("Thread tidak ditemukan");
      router.push("/dashboard/admin/forum");
    } finally {
      setLoading(false);
    }
  }

  // (opsional) admin actions — tombolnya tidak ditampilkan
  const handlePinThread = async () => {
    try { await api.post(`/admin/forum/threads/${threadId}/pin`); loadThread(); }
    catch (e:any) { alert(e.response?.data?.message || "Gagal mengubah status pin"); }
  };
  const handleLockThread = async () => {
    try { await api.post(`/admin/forum/threads/${threadId}/lock`); loadThread(); }
    catch (e:any) { alert(e.response?.data?.message || "Gagal mengubah status lock"); }
  };

  // Delete reply with modern modal + success banner
  const handleDeleteReply = async (replyId: number) => {
    setConfirmOpen(replyId);
  };
  const confirmDelete = async () => {
    if (!confirmOpen) return;
    setDeletingId(confirmOpen);
    try {
      await api.delete(`/forum/replies/${confirmOpen}`);
      setConfirmOpen(null);
      setDeletingId(null);
      setSuccessBanner("Balasan berhasil dihapus!");
      setTimeout(() => setSuccessBanner(null), 3500);
      await loadThread();
    } catch (e: any) {
      setDeletingId(null);
      alert(e?.response?.data?.message || "Gagal menghapus balasan");
    }
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

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
    <>
      <div className="min-h-screen bg-white p-6 pt-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Button - Static at top */}
          <Link
            href="/dashboard/admin/forum"
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 bg-white px-3 py-2 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-emerald-100 w-fit mt-4"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          {/* Success banner */}
          {successBanner && (
            <div className="
              w-full rounded-2xl border-2 border-emerald-200
              bg-emerald-50 text-emerald-900 px-4 py-3
              shadow-[0_6px_30px_rgba(16,185,129,0.12)]
              flex items-center gap-3
            ">
              <div className="w-9 h-9 rounded-xl bg-white grid place-items-center border border-emerald-200">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="font-semibold">{successBanner}</div>
            </div>
          )}

        {/* ======= Header + Konten Thread ======= */}
        <Card className={`${hoverCard} p-0`}>
          <div className="relative p-6 md:p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0 space-y-3">
                {statusChips}
                <h1 className="text-[32px] md:text-[40px] leading-tight font-extrabold tracking-tight text-gray-900 break-words [word-break:break-word]">
                  {thread.title}
                </h1>

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

            <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-100 to-transparent my-6" />

            <div className="rounded-2xl border-2 border-emerald-100 bg-white/70 p-5">
              <p className="text-[15px] md:text-base leading-7 text-gray-800 whitespace-pre-wrap break-words [word-break:break-word]">
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

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteReply(reply.id)}
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              title="Hapus balasan"
                            >
                              Hapus
                            </Button>
                          </div>

                          <div className="mt-3 text-gray-800 whitespace-pre-wrap leading-7 break-words [word-break:break-word]">
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

      {/* ===== Modal Konfirmasi Hapus ===== */}
      {confirmOpen !== null && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => (deletingId ? null : setConfirmOpen(null))}
          />

          {/* Dialog */}
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 grid place-items-center">
                      <ShieldAlert className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Hapus balasan ini?</h3>
                      <p className="text-gray-600 mt-1">
                        Tindakan ini tidak dapat dibatalkan. Balasan akan dihapus secara permanen.
                      </p>
                    </div>
                  </div>
                  <button
                    aria-label="Tutup"
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    onClick={() => (deletingId ? null : setConfirmOpen(null))}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800"
                    onClick={() => (deletingId ? null : setConfirmOpen(null))}
                    disabled={!!deletingId}
                  >
                    Batal
                  </Button>
                  <Button
                    className="bg-rose-600 hover:bg-rose-700"
                    onClick={confirmDelete}
                    disabled={!!deletingId}
                  >
                    {deletingId ? "Menghapus..." : "Hapus"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}