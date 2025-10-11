// app/(dashboard)/dashboard/user/forum/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/* ========= Helpers & Types ========= */
type UserLite = { id: string; nama?: string; name?: string; avatar_url?: string | null };
type Reply = { id: string; content: string; user: UserLite; created_at: string; is_mine?: boolean };
type ThreadDetail = {
  id: number;
  title: string;
  content: string;
  user: UserLite;
  assigned_nakes?: UserLite | null;
  is_pinned: boolean;
  is_locked: boolean;
  is_private: boolean;
  reply_count: number;
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

/* ========= Page ========= */
export default function ThreadDetailPage() {
  const params = useParams<{ id: string }>();
  const threadId = useMemo(() => Number(params?.id), [params]);

  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);

  // root reply
  const [rootText, setRootText] = useState("");
  const [rootPosting, setRootPosting] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/forum/threads/${threadId}`);
        const data: any = res?.data?.data ?? res?.data ?? {};

        const t: ThreadDetail = {
          id: Number(first(data, ["id"], threadId)),
          title: first(data, ["title", "judul"], "Tanpa Judul"),
          content: first(data, ["content", "konten", "body"], ""),
          user: normUser(first(data, ["user", "author"], {})),
          assigned_nakes: (() => {
            const n = first(data, ["assigned_nakes", "assigned", "nakes"], null);
            return n ? normUser(n) : null;
          })(),
          is_pinned: !!first(data, ["is_pinned", "pinned"], false),
          is_locked: !!first(data, ["is_locked", "locked"], false),
          is_private: !!first(data, ["is_private", "private"], false),
          reply_count: Number(first(data, ["reply_count", "replies_count", "comments_count"], 0)),
          created_at: String(first(data, ["created_at", "createdAt"], new Date().toISOString())),
          last_activity_at: first(data, ["last_activity_at", "updated_at", "updatedAt"], undefined),
        };
        if (!alive) return;
        setThread(t);

        const rawList: any[] = first(data, ["replies", "comments", "items"], []);
        const flat: Reply[] = (Array.isArray(rawList) ? rawList : []).map((r: any) => ({
          id: String(first(r, ["id"], crypto.randomUUID?.() ?? Math.random())),
          content: first(r, ["content", "body", "text"], ""),
          user: normUser(first(r, ["user", "author"], {})),
          created_at: String(first(r, ["created_at", "createdAt"], new Date().toISOString())),
          is_mine: !!first(r, ["is_mine"], false),
        }));
        flat.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
        setReplies(flat);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
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

  /* ========= UI ========= */
  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 md:px-10 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }
  if (!thread) {
    return (
      <div className="min-h-screen bg-white px-6 md:px-10 py-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <Link href="/dashboard/user/forum" className="inline-flex items-center gap-2 text-emerald-700">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <Card className="p-8 rounded-3xl border border-emerald-300/70">
            <p>Thread tidak ditemukan.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard/user/forum"
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>

        {/* Header Thread — samain look & feel */}
        <Card
          className="
            rounded-3xl p-6 border-2 border-gray-100 relative overflow-hidden
            hover:border-transparent hover:shadow-2xl transition-all duration-300
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-5 pointer-events-none" />
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-5 rounded-bl-full" />

          <div className="relative space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {thread.is_private && (
                <Badge className="bg-emerald-600 text-white">
                  <Shield className="w-3 h-3 mr-1" /> Private
                </Badge>
              )}
              {thread.is_pinned && (
                <Badge className="bg-emerald-600/90 text-white">
                  <Pin className="w-3 h-3 mr-1" /> Pinned
                </Badge>
              )}
              {thread.is_locked && (
                <Badge className="bg-red-600 text-white">
                  <Lock className="w-3 h-3 mr-1" /> Locked
                </Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{thread.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
              <span className="inline-flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 grid place-items-center text-emerald-700">
                  <UserIcon className="w-4 h-4" />
                </div>
                <strong className="text-gray-900">
                  {thread.user?.nama || thread.user?.name || "Pengguna"}
                </strong>
              </span>
              {thread.assigned_nakes && (
                <span className="inline-flex items-center gap-1">
                  <Stethoscope className="w-4 h-4" />
                  <span className="font-medium">
                    {thread.assigned_nakes.nama || thread.assigned_nakes.name}
                  </span>
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {fmtRel(thread.last_activity_at || thread.created_at)}
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {thread.reply_count} balasan
              </span>
            </div>

            <div className="mt-2 text-gray-800 whitespace-pre-wrap">{thread.content}</div>
          </div>
        </Card>

        {/* Form Balasan ke Thread (match styling) */}
        <Card
          className="
            rounded-3xl p-5 border-2 border-emerald-100
            hover:border-emerald-200 hover:shadow-xl transition-all duration-300
          "
        >
          <form onSubmit={submitRoot} className="space-y-3">
            <label className="text-sm font-semibold text-gray-800">Balas Diskusi</label>
            <Textarea
              value={rootText}
              onChange={(e) => setRootText(e.target.value)}
              placeholder={thread.is_locked ? "Thread terkunci — tidak bisa dibalas" : "Tulis balasan kamu di sini..."}
              rows={4}
              disabled={!canReplyRoot || rootPosting}
              className="rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-emerald-100 resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{rootText.length} karakter</span>
              <Button
                type="submit"
                disabled={!canReplyRoot || rootPosting || rootText.trim().length === 0}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <SendHorizonal className="w-4 h-4 mr-2" />
                Kirim Balasan
              </Button>
            </div>
          </form>
        </Card>

        {/* Daftar Balasan (flat) — hover & margin mengikuti list di halaman komunitas */}
        <Card className="p-0 rounded-3xl bg-white border-2 border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <h2 className="text-lg font-semibold text-gray-900">Balasan</h2>
          </div>

          {replies.length === 0 ? (
            <div className="p-8 text-center text-gray-600">Belum ada balasan. Jadilah yang pertama!</div>
          ) : (
            <ul className="space-y-5 p-5">
              {replies.map((r) => (
                <li key={r.id}>
                  <div
                    className="
                      group relative bg-white border-2 border-gray-100 rounded-2xl p-4
                      hover:border-transparent hover:shadow-2xl transition-all duration-300
                    "
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl" />
                    <div className="relative flex items-start gap-3">
                      <div
                        className="
                          flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl
                          bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow
                        "
                      >
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                          <strong className="text-gray-900">
                            {r.user?.nama || r.user?.name || "Pengguna"}
                          </strong>
                          {r.is_mine && (
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 text-[11px] font-medium">
                              Anda
                            </span>
                          )}
                          <span className="text-gray-500">• {fmtRel(r.created_at)}</span>
                        </div>
                        <div className="mt-2 text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {r.content}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
