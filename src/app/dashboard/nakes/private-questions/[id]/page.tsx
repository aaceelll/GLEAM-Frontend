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
  LockOpen,
  Trash2,
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
                {isSuccess && <CheckCircle2 className="w-6 h-6 text-white" />}
                {isError && <AlertCircle className="w-6 h-6 text-white" />}
                {toast.type === "info" && <AlertCircle className="w-6 h-6 text-white" />}
              </div>
              <p className="flex-1 font-semibold text-gray-900 text-sm">{toast.message}</p>
              <button
                onClick={() => onDismiss(toast.id)}
                className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ⭐ Confirm Modal Component - hanya untuk delete
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya, lanjut",
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
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Tutup dialog konfirmasi"
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{message}</p>

            <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={onClose}
              >
                {cancelText}
              </Button>
              <Button
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </div>
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

  // ⭐ Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Modal hanya untuk delete

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

  // ✅ Handler untuk toggle lock/unlock - TANPA MODAL
  const handleToggleLock = async () => {
    try {
      const response = await api.patch(`/forum/threads/${questionId}/toggle-lock`);
      showToast(response.data.message || "Status berhasil diubah!", "success");
      await loadQuestion(true); // Silent reload
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Gagal mengubah status", "error");
    }
  };

  // ✅ Handler untuk delete - DENGAN MODAL
  const handleDeleteQuestion = async () => {
    try {
      await api.delete(`/forum/threads/${questionId}/private`);
      showToast("Pertanyaan berhasil dihapus!", "success");
      setDeleteModalOpen(false);
      setTimeout(() => {
        router.push('/dashboard/nakes/private-questions');
      }, 1000);
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Gagal menghapus pertanyaan", "error");
      setDeleteModalOpen(false);
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

  return (
    <>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Delete Confirm Modal - HANYA untuk delete */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteQuestion}
        title="Hapus Pertanyaan?"
        message="Pertanyaan dan semua jawabannya akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
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

          {/* Form Jawaban atau Controls */}
          {myRole === "nakes" && (
            <Card className="p-8 border-2 border-emerald-200 rounded-3xl shadow-xl bg-white">
              {!question.is_locked ? (
                /* Form untuk Kirim Jawaban */
                <>
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

                    {/* Button Actions - RESPONSIVE dengan 3 button */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Button Kirim Jawaban */}
                      <Button
                        type="submit"
                        disabled={submitting || !answerContent.trim()}
                        className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 font-semibold text-base shadow-lg"
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

                      {/* Button Lock - Hanya tampil jika ada jawaban */}
                      {question.reply_count > 0 && (
                        <Button
                          type="button"
                          onClick={handleToggleLock}
                          variant="outline"
                          className="
                            w-full sm:w-auto
                            border-2 border-gray-300
                            text-gray-700
                            hover:bg-gray-100 hover:text-gray-900
                            h-12 px-6
                            transition-all duration-300
                            hover:shadow-lg hover:-translate-y-0.5
                            active:translate-y-0
                            rounded-xl
                          "
                        >
                          <Lock className="w-5 h-5 mr-2" />
                          Tutup
                        </Button>
                      )}

                      {/* Button Hapus */}
                      <Button
                        type="button"
                        onClick={() => setDeleteModalOpen(true)}
                        variant="outline"
                        className="
                          w-full sm:w-auto
                          border-2 border-red-300
                          text-red-700
                          hover:bg-red-50 hover:text-red-800
                          h-12 px-6
                          transition-all duration-300
                          hover:shadow-lg hover:-translate-y-0.5
                          active:translate-y-0
                          rounded-xl
                        "
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Hapus
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                /* Controls ketika pertanyaan dikunci */
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-gray-600" /> Pertanyaan Ditutup
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Pertanyaan ini sudah ditutup. Anda dapat membuka kembali atau menghapus pertanyaan.
                  </p>

                  {/* Button Actions untuk pertanyaan yang dikunci */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Button Buka */}
                    <Button
                      type="button"
                      onClick={handleToggleLock}
                      className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 font-semibold text-base shadow-lg"
                    >
                      <LockOpen className="w-5 h-5 mr-2" />
                      Buka Pertanyaan
                    </Button>

                    {/* Button Hapus */}
                    <Button
                      type="button"
                      onClick={() => setDeleteModalOpen(true)}
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-red-300 text-red-700 hover:bg-red-50 h-12 px-6"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Hapus
                    </Button>
                  </div>
                </>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}