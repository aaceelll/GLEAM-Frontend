// src/app/dashboard/user/forum/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Pin,
  Shield,
  Stethoscope,
  Lock,
  SendHorizonal,
  User as UserIcon,
  RefreshCw,
  CheckCircle,
  Clock,
  Eye,
  ThumbsUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/* ========= Helpers & Types ========= */
type UserLite = { 
  id: string; 
  nama?: string; 
  name?: string; 
  avatar_url?: string | null 
};

type Reply = { 
  id: string; 
  content: string; 
  user: UserLite; 
  created_at: string; 
  is_mine?: boolean;
  responder_role?: string;
};

type ThreadDetail = {
  id: number;
  title: string;
  content: string;
  user: UserLite;
  category?: {
    id: number;
    name: string;
    icon: string;
    color: string;
  } | null;
  assigned_nakes?: UserLite | null;
  is_pinned: boolean;
  is_locked: boolean;
  is_private: boolean;
  is_liked?: boolean;
  reply_count: number;
  view_count?: number;
  like_count?: number;
  created_at: string;
  last_activity_at?: string;
};

function first<T = any>(obj: any, keys: string[], fallback?: any): T | any {
  for (const k of keys) {
    const v = k.includes(".")
      ? k.split(".").reduce((acc: any, key) => (acc ? acc[key] : undefined), obj)
      : obj?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return fallback;
}

const normUser = (u: any): UserLite => ({
  id: String(u?.id ?? u?._id ?? ""),
  nama: u?.nama ?? u?.name,
  name: u?.name ?? u?.nama,
  avatar_url: u?.avatar_url ?? null,
});

function fmtRel(dateString: string) {
  const d = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const dd = Math.floor(diff / 86400000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit yang lalu`;
  if (h < 24) return `${h} jam yang lalu`;
  if (dd < 7) return `${dd} hari yang lalu`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/* ========= Page Component ========= */
export default function ThreadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const threadId = useMemo(() => Number(params?.id), [params]);

  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Root reply state
  const [rootText, setRootText] = useState("");
  const [rootPosting, setRootPosting] = useState(false);

  // ⭐ REAL-TIME: Load thread function
  const loadThread = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get(`/forum/threads/${threadId}`);
      const data: any = res?.data?.data ?? res?.data ?? {};

      const t: ThreadDetail = {
        id: Number(first(data, ["id"], threadId)),
        title: first(data, ["title", "judul"], "Tanpa Judul"),
        content: first(data, ["content", "konten", "body"], ""),
        user: normUser(first(data, ["user", "author"], {})),
        category: first(data, ["category"], null),
        assigned_nakes: (() => {
          const n = first(data, ["assigned_nakes", "assigned", "nakes"], null);
          return n ? normUser(n) : null;
        })(),
        is_pinned: !!first(data, ["is_pinned", "pinned"], false),
        is_locked: !!first(data, ["is_locked", "locked"], false),
        is_private: !!first(data, ["is_private", "private"], false),
        is_liked: !!first(data, ["is_liked"], false),
        reply_count: Number(first(data, ["reply_count", "replies_count", "comments_count"], 0)),
        view_count: Number(first(data, ["view_count"], 0)),
        like_count: Number(first(data, ["like_count"], 0)),
        created_at: String(first(data, ["created_at", "createdAt"], new Date().toISOString())),
        last_activity_at: first(data, ["last_activity_at", "updated_at", "updatedAt"], undefined),
      };
      setThread(t);

      const rawList: any[] = first(data, ["replies", "comments", "items"], []);
      const flat: Reply[] = (Array.isArray(rawList) ? rawList : []).map((r: any) => ({
        id: String(first(r, ["id"], crypto.randomUUID?.() ?? Math.random())),
        content: first(r, ["content", "body", "text"], ""),
        user: normUser(first(r, ["user", "author"], {})),
        created_at: String(first(r, ["created_at", "createdAt"], new Date().toISOString())),
        is_mine: !!first(r, ["is_mine"], false),
        responder_role: first(r, ["responder_role"], "user"),
      }));
      flat.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      setReplies(flat);
    } catch (e: any) {
      if (!silent) {
        alert(e?.response?.data?.message || "Thread tidak ditemukan");
        router.push("/dashboard/user/forum");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadThread();
  }, [threadId]);

  // ⭐ REAL-TIME: Auto-polling setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      loadThread(true); // Silent reload
    }, 5000);
    return () => clearInterval(interval);
  }, [threadId]);

  const canReplyRoot = !!thread && !thread.is_locked;

  async function submitRoot(e: React.FormEvent) {
    e.preventDefault();
    if (!canReplyRoot || !rootText.trim()) return;
    setRootPosting(true);

    const tempId = `temp-root-${Date.now()}`;
    const optimistic: Reply = {
      id: tempId,
      content: rootText.trim(),
      user: { id: "0", nama: "Anda", name: "Anda", avatar_url: null },
      created_at: new Date().toISOString(),
      is_mine: true,
      responder_role: "user",
    };
    setReplies((prev) => [optimistic, ...prev]);
    setRootText("");

    try {
      const saved = await api.post(`/forum/threads/${threadId}/reply`, {
        content: optimistic.content,
        parent_id: null,
      });
      const real: Reply = {
        id: String(first(saved?.data ?? saved, ["data.id", "id"], tempId)),
        content: first(saved?.data ?? saved, ["data.content", "content"], optimistic.content),
        user: normUser(first(saved?.data ?? saved, ["data.user", "user"], optimistic.user)),
        created_at: String(first(saved?.data ?? saved, ["data.created_at", "created_at", "createdAt"], optimistic.created_at)),
        is_mine: true,
        responder_role: "user",
      };
      setReplies((prev) => [real, ...prev.filter((r) => r.id !== tempId)]);
      setThread((t) => (t ? { ...t, reply_count: (t.reply_count ?? 0) + 1 } : t));
    } catch (err: any) {
      setReplies((prev) => prev.filter((r) => r.id !== tempId));
      alert(err?.response?.data?.message || "Gagal mengirim balasan");
      setRootText(optimistic.content);
    } finally {
      setRootPosting(false);
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadThread();
    setTimeout(() => setRefreshing(false), 500);
  };

  /* ========= UI ========= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-6 md:px-10 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-emerald-700 font-semibold">Memuat diskusi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-6 md:px-10 py-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <Link 
            href="/dashboard/user/forum" 
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <Card className="p-8 rounded-3xl border-2 border-emerald-200 bg-white">
            <p className="text-gray-700">Thread tidak ditemukan.</p>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (thread.is_locked) {
      return (
        <Badge className="bg-gray-500 text-white px-3 py-1 shadow-lg">
          <Lock className="w-4 h-4 mr-1" />
          Ditutup
        </Badge>
      );
    }
    if (replies.length > 0) {
      return (
        <Badge className="bg-emerald-600 text-white px-3 py-1 shadow-lg">
          <CheckCircle className="w-4 h-4 mr-1" />
          Sudah Dijawab
        </Badge>
      );
    }
    if (thread.assigned_nakes) {
      return (
        <Badge className="bg-blue-600 text-white px-3 py-1 shadow-lg">
          <Stethoscope className="w-4 h-4 mr-1" />
          Sedang Ditangani
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-500 text-white px-3 py-1 shadow-lg">
        <Clock className="w-4 h-4 mr-1" />
        Menunggu Jawaban
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 md:px-10 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header dengan back button dan refresh */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link
            href="/dashboard/user/forum"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-white border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all shadow-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>

          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Main Thread Card */}
        <Card className="p-6 md:p-8 border-2 border-emerald-100 rounded-3xl shadow-xl bg-white relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-[0.02] pointer-events-none" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-[0.03] rounded-bl-full pointer-events-none" />

          <div className="relative space-y-5">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {thread.category && (
                <Badge 
                  style={{ 
                    backgroundColor: thread.category.color, 
                    color: "white" 
                  }}
                  className="px-3 py-1 shadow-md font-semibold"
                >
                  <span className="mr-1">{thread.category.icon}</span>
                  {thread.category.name}
                </Badge>
              )}
              {thread.is_private && (
                <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1 shadow-lg">
                  <Shield className="w-3 h-3 mr-1" /> Private
                </Badge>
              )}
              {thread.is_pinned && (
                <Badge className="bg-emerald-600/90 text-white px-3 py-1 shadow-lg">
                  <Pin className="w-3 h-3 mr-1" /> Pinned
                </Badge>
              )}
              {getStatusBadge()}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {thread.title}
            </h1>

            {/* User info */}
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{thread.user.nama || "User"}</p>
                <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {fmtRel(thread.created_at)}
                  </span>
                  {thread.view_count !== undefined && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {thread.view_count} views
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
                {thread.content}
              </p>
            </div>

            {/* Assigned nakes info (jika private) */}
            {thread.is_private && thread.assigned_nakes && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Ditangani oleh:</p>
                  <p className="text-base font-bold text-blue-800">{thread.assigned_nakes.nama}</p>
                </div>
              </div>
            )}

            {/* Stats bar */}
            <div className="flex items-center gap-4 pt-4 border-t border-emerald-100 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <strong className="text-gray-900">{thread.reply_count}</strong> balasan
              </span>
              {thread.like_count !== undefined && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <strong className="text-gray-900">{thread.like_count}</strong> likes
                  </span>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Replies Section */}
        {replies.length > 0 && (
          <Card className="p-6 md:p-8 border-2 border-emerald-100 rounded-3xl shadow-xl bg-white">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              Balasan ({replies.length})
            </h3>
            <div className="space-y-4">
              {replies.map((reply) => {
                const isNakes = reply.responder_role === "nakes";
                const isAdmin = reply.responder_role === "admin";
                return (
                  <div
                    key={reply.id}
                    className={`rounded-2xl p-5 border-2 shadow-md transition-all hover:shadow-lg ${
                      isNakes
                        ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
                        : isAdmin
                        ? "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${
                          isNakes 
                            ? "bg-gradient-to-br from-emerald-600 to-teal-600" 
                            : isAdmin
                            ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {isNakes ? (
                          <Stethoscope className="w-5 h-5" />
                        ) : isAdmin ? (
                          <Shield className="w-5 h-5" />
                        ) : (
                          <UserIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900">{reply.user.nama || "User"}</p>
                          {isNakes && (
                            <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0.5">
                              Tenaga Kesehatan
                            </Badge>
                          )}
                          {isAdmin && (
                            <Badge className="bg-purple-600 text-white text-[10px] px-2 py-0.5">
                              Admin
                            </Badge>
                          )}
                          {reply.is_mine && (
                            <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-emerald-600 text-emerald-700">
                              Anda
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{fmtRel(reply.created_at)}</p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Reply Form (jika tidak locked) */}
        {canReplyRoot && (
          <Card className="p-6 md:p-8 border-2 border-emerald-200 rounded-3xl shadow-xl bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <SendHorizonal className="w-5 h-5 text-emerald-600" />
              Balas Diskusi
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {thread.is_private 
                ? "Anda dapat menambahkan informasi atau merespons jawaban dari tenaga kesehatan."
                : "Bergabunglah dalam diskusi dengan memberikan tanggapan Anda."}
            </p>
            <form onSubmit={submitRoot}>
              <Textarea
                rows={5}
                value={rootText}
                onChange={(e) => setRootText(e.target.value)}
                placeholder="Tulis balasan Anda di sini..."
                className="mb-4 border-2 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl resize-none"
                required
                disabled={rootPosting}
              />
              <Button
                type="submit"
                disabled={rootPosting || !rootText.trim()}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-11 font-semibold shadow-lg text-base"
              >
                {rootPosting ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="w-5 h-5 mr-2" />
                    Kirim Balasan
                  </>
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Locked message */}
        {thread.is_locked && (
          <Card className="p-6 border-2 border-gray-300 bg-gray-50 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 text-gray-700">
              <Lock className="w-6 h-6 text-gray-500" />
              <div>
                <h3 className="font-bold text-lg">Diskusi Ditutup</h3>
                <p className="text-sm">
                  {thread.is_private 
                    ? "Pertanyaan ini sudah ditutup oleh tenaga kesehatan."
                    : "Diskusi ini telah ditutup dan tidak menerima balasan baru."}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Auto-refresh indicator */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-3 h-3" />
            Halaman akan refresh otomatis setiap 5 detik untuk menampilkan balasan terbaru
          </p>
        </div>
      </div>
    </div>
  );
} 