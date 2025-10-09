"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Stethoscope,
  Calendar,
  MessageSquare,
  Send,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface UserType { id: number; nama: string; role?: string; }
interface Category { id: number; name: string; icon: string; color: string; }
interface Reply { id: number; content: string; user: UserType; responder_role: string; created_at: string; }
interface Thread {
  id: number; title: string; content: string; user: UserType;
  category: Category; assigned_nakes: UserType | null; is_private: boolean; is_locked: boolean;
  view_count: number; reply_count: number; created_at: string; replies: Reply[];
}

export default function NakesQuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;

  const [question, setQuestion] = useState<Thread | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.get("/auth/me");
        setCurrentUser(me.data.data);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/forum/threads/${questionId}`);
        setQuestion(res.data);
      } catch (e: any) {
        alert(e?.response?.data?.message || "Pertanyaan tidak ditemukan");
        router.push("/dashboard/nakes/private-questions");
      } finally {
        setLoading(false);
      }
    })();
  }, [questionId, router]);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const formatRelative = (s: string) => {
    const d = new Date(s), now = new Date(), ms = now.getTime() - d.getTime();
    const m = Math.floor(ms / 60000), h = Math.floor(ms / 3600000), day = Math.floor(ms / 86400000);
    if (m < 1) return "Baru saja";
    if (m < 60) return `${m} menit yang lalu`;
    if (h < 24) return `${h} jam yang lalu`;
    if (day < 7) return `${day} hari yang lalu`;
    return formatDate(s);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 md:px-10 py-6 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }
  if (!question) return null;

  // — logic (tidak gunakan hooks)
  const isAssignedToMe = question.assigned_nakes?.id === currentUser?.id;
  const iReplied = !!question.replies?.some((r) => r.user.id === currentUser?.id);
  const canAnswer = isAssignedToMe && !question.is_locked && !iReplied;

  const getStatusBadge = () => {
    if (question.is_locked)
      return <Badge className="bg-gray-500 text-white text-sm px-3 py-1"><XCircle className="w-4 h-4 mr-1" />Ditutup</Badge>;
    if (question.reply_count > 0)
      return <Badge className="bg-emerald-600 text-white text-sm px-3 py-1"><CheckCircle className="w-4 h-4 mr-1" />Sudah Dijawab</Badge>;
    if (question.assigned_nakes)
      return <Badge className="bg-blue-600 text-white text-sm px-3 py-1"><Stethoscope className="w-4 h-4 mr-1" />Sedang Ditangani</Badge>;
    return <Badge className="bg-amber-500 text-white text-sm px-3 py-1"><Clock className="w-4 h-4 mr-1" />Menunggu</Badge>;
  };

  const handleAssignToSelf = async () => {
    if (!confirm("Ambil pertanyaan ini untuk dijawab?")) return;
    try {
      await api.post(`/forum/threads/${questionId}/assign`);
      alert("Pertanyaan berhasil diambil!");
      const r = await api.get(`/forum/threads/${questionId}`);
      setQuestion(r.data);
    } catch (e: any) {
      alert(e?.response?.data?.message || "Gagal mengambil pertanyaan");
    }
  };

  const handleCloseQuestion = async () => {
    if (!confirm("Tutup pertanyaan ini?")) return;
    try {
      await api.patch(`/forum/threads/${questionId}/close`);
      alert("Pertanyaan ditutup");
      const r = await api.get(`/forum/threads/${questionId}`);
      setQuestion(r.data);
    } catch (e: any) {
      alert(e?.response?.data?.message || "Gagal menutup pertanyaan");
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/forum/threads/${questionId}/reply`, { content: answerContent });
      setAnswerContent("");
      const r = await api.get(`/forum/threads/${questionId}`);
      setQuestion(r.data);
    } catch (e: any) {
      alert(e?.response?.data?.message || "Gagal mengirim jawaban");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back button — modern pill */}
        <div className="sticky top-0 z-10 -mt-2 pt-2 bg-white/70 backdrop-blur">
          <Link href="/dashboard/nakes/private-questions">
            <Button
              variant="ghost"
              className="rounded-full border-2 border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Pertanyaan
            </Button>
          </Link>
        </div>

        {/* Info assignment / status */}
        {!question.assigned_nakes && (
          <Card className="p-6 border-2 border-amber-200 bg-amber-50 rounded-2xl">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 text-amber-800">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Pertanyaan Belum Diambil</p>
                  <p className="text-sm">Ambil untuk mulai membantu pasien.</p>
                </div>
              </div>
              <Button onClick={handleAssignToSelf} className="bg-emerald-600 hover:bg-emerald-700">
                <Stethoscope className="w-4 h-4 mr-2" />Ambil Pertanyaan
              </Button>
            </div>
          </Card>
        )}

        {question.assigned_nakes && !isAssignedToMe && (
          <Card className="p-4 border-2 border-emerald-200 bg-emerald-50 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-800">
              <Stethoscope className="w-5 h-5" />
              Ditangani oleh <b className="ml-1">{question.assigned_nakes.nama}</b>
            </div>
          </Card>
        )}

        {/* Main card */}
        <Card className="p-8 border-2 border-gray-100 rounded-3xl shadow-xl">
          {/* Header status */}
          <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <Badge style={{ backgroundColor: question.category.color, color: "white" }}>
                {question.category.icon} {question.category.name}
              </Badge>
            </div>
            {/* Hapus tombol tutup? -> kalau tetap perlu, pakai handleCloseQuestion; kalau tidak, tinggal sembunyikan. */}
            {/* <Button onClick={handleCloseQuestion} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
              <Lock className="w-4 h-4 mr-2" />Tutup Pertanyaan
            </Button> */}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{question.title}</h1>

          {/* Info penanya */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold">
              {question.user.nama.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{question.user.nama}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formatDate(question.created_at)}
              </p>
            </div>
          </div>

          {/* Content + divider di bawah konten */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{question.content}</p>
          </div>
          <div className="mt-6 border-t border-gray-200" />

          {/* Answers (langsung di bawah pertanyaan) */}
          {question.replies.length > 0 && (
            <div className="space-y-4 pt-6">
              {question.replies.map((reply) => (
                <div key={reply.id} className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {reply.user.nama}
                          <Badge className="ml-2 bg-emerald-600 text-white text-[10px]">
                            {reply.responder_role === "nakes" ? "Tenaga Kesehatan" : "Admin"}
                          </Badge>
                          {reply.user.id === currentUser?.id && (
                            <Badge variant="outline" className="ml-2 text-[10px]">Anda</Badge>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{formatRelative(reply.created_at)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-emerald-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Answer form (hanya saat boleh jawab) */}
        {canAnswer && (
          <Card className="p-8 border-2 border-gray-100 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" /> Kirim Jawaban
            </h2>
            <form onSubmit={handleSubmitAnswer}>
              <Textarea
                rows={8}
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Tulis jawaban profesional dan jelas…"
                className="mb-4 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                required
                disabled={submitting}
              />
              <Button
                type="submit"
                disabled={submitting || !answerContent.trim()}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 w-full h-11 font-semibold"
              >
                {submitting ? "Mengirim…" : "Kirim Jawaban"}
              </Button>
            </form>
          </Card>
        )}

        {question.is_locked && (
          <Card className="p-6 border-2 border-gray-200 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-2 text-gray-700">
              <Lock className="w-5 h-5" /> Pertanyaan telah ditutup.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
