// app/(dashboard)/dashboard/nakes/private-questions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  Stethoscope,
  Calendar,
  User,
  Lock, // ⟵ tambah untuk badge "Private"
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

/* ================= Types ================= */
interface Question {
  id: number;
  title: string;
  content: string;
  user: { id: number; nama: string };
  category: { id: number; name: string; icon: string; color: string };
  reply_count: number;
  view_count: number;
  created_at: string;
}

/* ===== Helper: sort terbaru di atas ===== */
const sortDesc = (arr: Question[]) =>
  [...arr].sort((a, b) => {
    const t = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (t !== 0) return t;
    return (b.id ?? 0) - (a.id ?? 0);
  });

/* ===== Modal konfirmasi minimal ===== */
function ConfirmModal({
  open,
  title,
  description,
  onConfirm,
  onClose,
  confirmText = "Ya, lanjut",
  cancelText = "Batal",
}: {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-emerald-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-emerald-100">
          <h3 className="text-lg font-bold text-emerald-900">{title}</h3>
          {description ? <p className="text-sm text-emerald-700 mt-1">{description}</p> : null}
        </div>
        <div className="px-6 py-5 flex gap-3 justify-end bg-white">
          <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 hover:bg-gray-100">
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ================ Page =================== */
export default function NakesPrivateQuestionsPage() {
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const [myQuestions, setMyQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "my-questions">("pending");

  // modal state
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    setLoading(true);
    try {
      const [pendingRes, myRes] = await Promise.all([
        api.get("/forum/private/pending"),
        api.get("/forum/private/my-assignments"),
      ]);

      // URUT TERBARU DI ATAS
      setPendingQuestions(sortDesc(pendingRes.data as Question[]));
      setMyQuestions(sortDesc(myRes.data as Question[]));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // tidak ada toast/alert; setelah assign pindah tab otomatis
  async function assignNow(id: number) {
    try {
      await api.post(`/forum/threads/${id}/assign`);
      setConfirmId(null);
      await loadQuestions();
      setTab("my-questions");
    } catch (error) {
      setConfirmId(null);
      console.error(error);
    }
  }

  // waktu relatif ringan
  const fmt = (s: string) =>
    new Date(s).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  const rel = (s: string) => {
    const d = new Date(s).getTime();
    const now = Date.now();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari yang lalu`;
    return fmt(s);
  };

  const greenGrad = "from-emerald-600 to-teal-600";

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-6">
      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmId !== null}
        title="Ambil & Jawab Pertanyaan?"
        description="Pertanyaan akan ditugaskan ke Anda sehingga bisa segera dijawab."
        onConfirm={() => assignNow(confirmId as number)}
        onClose={() => setConfirmId(null)}
        confirmText="Ambil Sekarang"
        cancelText="Batal"
      />

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
                <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

             {/* Judul + subjudul */}
            <div>
              <h1 className="text-[22px] leading-[1.15] sm:text-3xl md:text-4xl font-bold text-gray-800">
                Pertanyaan Private dari Pasien<br className="hidden sm:block" />
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-0.5">
                Jawab Pertanyaan Private Pasien Anda di Sini
              </p>
            </div>
          </div>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: pendingQuestions.length, label: "Pertanyaan Baru", icon: <Clock className="w-6 h-6" /> },
            { n: myQuestions.length, label: "Pertanyaan Saya", icon: <MessageSquare className="w-6 h-6" /> },
            { n: myQuestions.filter((q) => q.reply_count > 0).length, label: "Sudah Dijawab", icon: <CheckCircle className="w-6 h-6" /> },
          ].map((s, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-white p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{s.label}</p>
                  <p className={`text-4xl font-bold mt-2 bg-gradient-to-r ${greenGrad} bg-clip-text text-transparent`}>
                    {s.n}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${greenGrad} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs + List */}
        <Card className="rounded-3xl border-2 border-gray-100 shadow-xl">
          <div className="px-6 pt-6">
            {/* Navigation Pills */}
            <div className="flex gap-2 sm:gap-3 p-1 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-100 shadow-lg mb-6">
              <button
                onClick={() => setTab("pending")}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300
                  ${
                    tab === "pending"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02]"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 hover:shadow-md"
                  }`}
              >
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="hidden sm:inline">Pertanyaan Baru</span>
                <span className="sm:hidden">Baru</span>
                <span
                  className={`inline-flex items-center justify-center h-5 sm:h-6 min-w-[20px] sm:min-w-6 px-1.5 sm:px-2 rounded-full text-xs font-bold ${
                    tab === "pending" ? "bg-white/25 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {pendingQuestions.length}
                </span>
              </button>

              <button
                onClick={() => setTab("my-questions")}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300
                  ${
                    tab === "my-questions"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02]"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 hover:shadow-md"
                  }`}
              >
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="hidden sm:inline">Pertanyaan Saya</span>
                <span className="sm:hidden">Saya</span>
                <span
                  className={`inline-flex items-center justify-center h-5 sm:h-6 min-w-[20px] sm:min-w-6 px-1.5 sm:px-2 rounded-full text-xs font-bold ${
                    tab === "my-questions" ? "bg-white/25 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {myQuestions.length}
                </span>
              </button>
            </div>

            {/* PENDING */}
            {tab === "pending" && (
              <div className="pt-6 pb-2">
                {loading ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Memuat pertanyaan…</p>
                  </div>
                ) : pendingQuestions.length === 0 ? (
                  <div className="text-center py-14">
                    <Clock className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-700 font-semibold">Tidak ada pertanyaan baru</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {pendingQuestions.map((q) => (
  <Card
    key={q.id}
    className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-5 hover:border-emerald-300 hover:shadow-xl transition-all"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative flex gap-4 items-start">
      {/* avatar */}
      <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow flex-shrink-0">
        {q.user.nama.charAt(0).toUpperCase()}
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        {/* badges */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge className="bg-amber-500 text-white">Baru</Badge>
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Lock className="w-3 h-3 mr-1" />
            Private
          </Badge>
        </div>

        {/* title & excerpt */}
        <h3 className="font-bold text-gray-900 text-lg">{q.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{q.content}</p>

        {/* bottom row: info ⟷ button (SEJAJAR) */}
        <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <strong>{q.user.nama}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {rel(q.created_at)}
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => setConfirmId(q.id)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm"
          >
            <Stethoscope className="w-4 h-4 mr-1.5" />
            Ambil & Jawab
          </Button>
        </div>
      </div>
    </div>
  </Card>
))}

                  </div>
                )}
              </div>
            )}

            {/* MY QUESTIONS */}
            {tab === "my-questions" && (
              <div className="pt-6 pb-2">
                {loading ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Memuat…</p>
                  </div>
                ) : myQuestions.length === 0 ? (
                  <div className="text-center py-14">
                    <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-700 font-semibold">Belum ada pertanyaan yang Anda tangani</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {myQuestions.map((q) => (
                      <Link key={q.id} href={`/dashboard/nakes/private-questions/${q.id}`}>
                        <Card className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-5 hover:border-emerald-300 hover:shadow-xl transition-all cursor-pointer">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative flex gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow flex-shrink-0">
                              {q.user.nama.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                {/* Status beda warna */}
                                {q.reply_count > 0 ? (
                                  <Badge className="bg-emerald-600 text-white">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Dijawab
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-600 text-white">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Belum Dijawab
                                  </Badge>
                                )}

                                {/* Ganti "Umum" -> "Private" */}
                                <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Private
                                </Badge>
                              </div>

                              <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">
                                {q.title}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{q.content}</p>

                              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1.5">
                                  <User className="w-4 h-4" />
                                  <strong>{q.user.nama}</strong>
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" />
                                  {rel(q.created_at)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <MessageSquare className="w-4 h-4" />
                                  {q.reply_count} jawaban
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}