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
  User,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface UserType {
  id: number;
  nama: string;
  role?: string;
}
interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}
interface Reply {
  id: number;
  content: string;
  user: UserType;
  responder_role: string;
  created_at: string;
}
interface Thread {
  id: number;
  title: string;
  content: string;
  user: UserType;
  category: Category;
  assigned_nakes: UserType | null;
  is_private: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  created_at: string;
  replies: Reply[];
}

// ⭐ Toast Component - Tema GLEAM
type ToastType = "success" | "error" | "info";
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3 max-w-md">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        
        return (
          <div
            key={toast.id}
            className={`
              relative overflow-hidden rounded-2xl border-2 shadow-2xl backdrop-blur-xl
              transform transition-all duration-300 animate-in slide-in-from-right
              ${isSuccess ? "bg-emerald-50 border-emerald-300" : ""}
              ${isError ? "bg-red-50 border-red-300" : ""}
              ${toast.type === "info" ? "bg-blue-50 border-blue-300" : ""}
            `}
          >
            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 opacity-5 ${
                isSuccess ? "bg-gradient-to-r from-emerald-500 to-teal-500" : ""
              } ${isError ? "bg-gradient-to-r from-red-500 to-rose-500" : ""} ${
                toast.type === "info" ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""
              }`}
            />
            
            {/* Content */}
            <div className="relative flex items-center gap-3 px-5 py-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                  isSuccess ? "bg-emerald-600" : ""
                } ${isError ? "bg-red-600" : ""} ${
                  toast.type === "info" ? "bg-blue-600" : ""
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-white" />}
                {isError && <AlertCircle className="w-5 h-5 text-white" />}
                {toast.type === "info" && <MessageSquare className="w-5 h-5 text-white" />}
              </div>
              
              <p className="flex-1 text-sm font-semibold text-gray-900 pr-4">
                {toast.message}
              </p>
              
              <button
                onClick={() => onDismiss(toast.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full animate-progress ${
                  isSuccess ? "bg-emerald-600" : ""
                } ${isError ? "bg-red-600" : ""} ${
                  toast.type === "info" ? "bg-blue-600" : ""
                }`}
                style={{
                  animation: "progress 3s linear forwards",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ⭐ Confirmation Modal - Tema GLEAM
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl border-2 border-emerald-200 shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-30 rounded-3xl pointer-events-none" />
        
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-7 h-7 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {title}
          </h3>
          
          <p className="text-gray-600 text-center mb-6">
            {message}
          </p>
          
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-2 border-gray-300 hover:bg-gray-100 h-11"
            >
              {cancelText}
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-11 shadow-lg"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NakesQuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;

  const [question, setQuestion] = useState<Thread | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [myRole, setMyRole] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  // ⭐ Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Toast functions
  const showToast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load user
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/me");
        
        let userData = null;
        if (res.data?.data) {
          userData = res.data.data;
        } else if (res.data?.user) {
          userData = res.data.user;
        } else {
          userData = res.data;
        }
        
        const role = (userData?.role || "").toLowerCase();
        setMyRole(role);
      } catch (e) {
        const stored = localStorage.getItem("user_data");
        if (stored) {
          try {
            const user = JSON.parse(stored);
            const role = (user?.role || "").toLowerCase();
            setMyRole(role);
          } catch {}
        }
      }
    })();
  }, []);

  // Load question
  const loadQuestion = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get(`/forum/threads/${questionId}`);
      setQuestion(res.data);
    } catch (e: any) {
      if (!silent) {
        showToast(e?.response?.data?.message || "Pertanyaan tidak ditemukan", "error");
        setTimeout(() => {
          router.push("/dashboard/nakes/private-questions");
        }, 1500);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [questionId]);

  // Auto-polling
  useEffect(() => {
    const interval = setInterval(() => {
      loadQuestion(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [questionId]);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatRelative = (s: string) => {
    const d = new Date(s),
      now = new Date(),
      ms = now.getTime() - d.getTime();
    const m = Math.floor(ms / 60000),
      h = Math.floor(ms / 3600000),
      day = Math.floor(ms / 86400000);
    if (m < 1) return "Baru saja";
    if (m < 60) return `${m} menit yang lalu`;
    if (h < 24) return `${h} jam yang lalu`;
    if (day < 7) return `${day} hari yang lalu`;
    return formatDate(s);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 md:px-10 py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-emerald-700 font-semibold">Memuat pertanyaan...</p>
        </div>
      </div>
    );
  }
  if (!question) return null;

  const canAnswer = myRole === "nakes" && !question.is_locked;

  const getStatusBadge = () => {
    if (question.is_locked)
      return (
        <Badge className="bg-gray-500 text-white text-sm px-3 py-1 shadow-lg">
          <XCircle className="w-4 h-4 mr-1" />
          Ditutup
        </Badge>
      );
    if (question.reply_count > 0)
      return (
        <Badge className="bg-emerald-600 text-white text-sm px-3 py-1 shadow-lg">
          <CheckCircle className="w-4 h-4 mr-1" />
          Sudah Dijawab
        </Badge>
      );
    if (question.assigned_nakes)
      return (
        <Badge className="bg-blue-600 text-white text-sm px-3 py-1 shadow-lg">
          <Stethoscope className="w-4 h-4 mr-1" />
          Sedang Ditangani
        </Badge>
      );
    return (
      <Badge className="bg-amber-500 text-white text-sm px-3 py-1 shadow-lg">
        <Clock className="w-4 h-4 mr-1" />
        Menunggu
      </Badge>
    );
  };

  const handleCloseQuestion = async () => {
    try {
      await api.patch(`/forum/threads/${questionId}/close`);
      showToast("Pertanyaan berhasil ditutup!", "success");
      await loadQuestion();
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Gagal menutup pertanyaan", "error");
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) {
      showToast("Jawaban tidak boleh kosong", "error");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/forum/threads/${questionId}/reply`, {
        content: answerContent,
      });
      setAnswerContent("");
      await loadQuestion();
      showToast("Jawaban berhasil dikirim!", "success");
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Gagal mengirim jawaban", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadQuestion();
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleCloseQuestion}
        title="Tutup Pertanyaan?"
        message="Pertanyaan akan dikunci dan tidak bisa dijawab lagi. Pastikan Anda sudah memberikan jawaban yang lengkap."
        confirmText="Ya, Tutup"
        cancelText="Batal"
      />

      <div className="min-h-screen bg-white px-6 md:px-10 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link
              href="/dashboard/nakes/private-questions"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-white border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold">Kembali</span>
            </Link>

            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Info assignment */}
          {!question.assigned_nakes && !question.is_locked && (
            <Card className="p-6 border-2 border-emerald-200 bg-emerald-50 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 text-emerald-800">
                <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Pertanyaan Belum Ditangani</h3>
                  <p className="text-sm text-emerald-700">
                    Anda bisa langsung menjawab. Pertanyaan akan otomatis ditugaskan kepada Anda.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Main card */}
          <Card className="p-8 border-2 border-emerald-100 rounded-3xl shadow-xl bg-white">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {question.category.icon}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-emerald-700">
                    Private
                  </h2>
                  <p className="text-xs text-gray-500">Pertanyaan Private</p>
                </div>
              </div>
              {getStatusBadge()}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 leading-tight break-words">
              {question.title}
            </h1>

            {/* Info penanya */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{question.user.nama}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {formatDate(question.created_at)}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 mb-6">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base sm:text-lg break-words">
                {question.content}
              </p>
            </div>

            {/* Jawaban */}
            {question.replies.length > 0 && (
              <>
                <div className="border-t-2 border-emerald-100 my-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  Jawaban ({question.replies.length})
                </h3>
                <div className="space-y-4">
                  {question.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md">
                            <Stethoscope className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-900">{reply.user.nama}</p>
                              <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0.5">
                                {reply.responder_role === "nakes"
                                  ? "Nakes"
                                  : reply.responder_role === "admin"
                                  ? "Admin"
                                  : "User"}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatRelative(reply.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm">
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed break-words">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Form Jawaban */}
          {canAnswer && (
            <Card className="p-8 border-2 border-emerald-200 rounded-3xl shadow-xl bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Send className="w-6 h-6 text-emerald-600" /> Kirim Jawaban
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Berikan jawaban yang jelas dan profesional untuk membantu pasien.
              </p>
              <form onSubmit={handleSubmitAnswer}>
                <Textarea
                  rows={8}
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Tulis jawaban profesional dan jelas di sini..."
                  className="mb-4 border-2 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white rounded-xl resize-none text-base"
                  required
                  disabled={submitting}
                />
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={submitting || !answerContent.trim()}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 font-semibold text-base shadow-lg"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Kirim Jawaban
                      </>
                    )}
                  </Button>
                  {question.reply_count > 0 && !question.is_locked && (
                    <Button
                      type="button"
                      onClick={() => setConfirmModalOpen(true)}
                      variant="outline"
                      className="border-2 border-gray-300 hover:bg-gray-100 h-12 px-6"
                    >
                      <Lock className="w-5 h-5 mr-2" />
                      Tutup
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          )}

          {/* Auto-refresh indicator */}
          <div className="text-center py-4">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-3 h-3" />
              Auto-refresh setiap 5 detik
            </p>
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx global>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </>
  );
}