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
  User,
  Shield,
  Eye,
  Lock,
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
    loadCurrentUser();
    loadQuestion();
  }, [questionId]);

  const loadCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setCurrentUser(response.data.data);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadQuestion = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/forum/threads/${questionId}`);
      setQuestion(response.data);
    } catch (error: any) {
      console.error("Error loading question:", error);
      alert(error.response?.data?.message || "Pertanyaan tidak ditemukan");
      router.push("/dashboard/nakes/private-questions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) return;

    setSubmitting(true);
    try {
      await api.post(`/forum/threads/${questionId}/reply`, {
        content: answerContent,
      });
      alert("Jawaban berhasil dikirim! 🎉");
      setAnswerContent("");
      loadQuestion();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengirim jawaban");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignToSelf = async () => {
    if (!confirm("Ambil pertanyaan ini untuk dijawab?")) return;

    try {
      await api.post(`/forum/threads/${questionId}/assign`);
      alert("Pertanyaan berhasil diambil!");
      loadQuestion();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengambil pertanyaan");
    }
  };

  const handleCloseQuestion = async () => {
    if (!confirm("Tutup pertanyaan ini?")) return;

    try {
      await api.patch(`/forum/threads/${questionId}/close`);
      alert("Pertanyaan ditutup");
      loadQuestion();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menutup pertanyaan");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateString: string) => {
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
    return formatDate(dateString);
  };

  const getStatusBadge = () => {
    if (!question) return null;

    if (question.is_locked) {
      return (
        <Badge className="bg-gray-500 text-white text-sm px-3 py-1">
          <XCircle className="w-4 h-4 mr-1" />
          Ditutup
        </Badge>
      );
    }

    if (question.reply_count > 0) {
      return (
        <Badge className="bg-green-500 text-white text-sm px-3 py-1">
          <CheckCircle className="w-4 h-4 mr-1" />
          Sudah Dijawab
        </Badge>
      );
    }

    if (question.assigned_nakes) {
      return (
        <Badge className="bg-blue-500 text-white text-sm px-3 py-1">
          <Stethoscope className="w-4 h-4 mr-1" />
          Sedang Ditangani
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-500 text-white text-sm px-3 py-1">
        <Clock className="w-4 h-4 mr-1" />
        Menunggu
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat pertanyaan...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600">Pertanyaan tidak ditemukan</p>
          <Link href="/dashboard/nakes/private-questions">
            <Button className="mt-4 bg-teal-600 hover:bg-teal-700">Kembali</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isAssignedToMe = question.assigned_nakes?.id === currentUser?.id;
  const canAnswer = isAssignedToMe && !question.is_locked;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/dashboard/nakes/private-questions">
          <Button variant="ghost" className="hover:bg-teal-100 text-teal-700 font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Pertanyaan
          </Button>
        </Link>

        {/* Privacy Notice */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 shadow-lg">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900">Pertanyaan Private</p>
              <p className="text-sm text-blue-700">
                Jawaban Anda hanya akan dilihat oleh pasien yang bertanya. Berikan jawaban profesional dan membantu.
              </p>
            </div>
          </div>
        </Card>

        {/* Assignment Status */}
        {!question.assigned_nakes && (
          <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="font-bold text-yellow-900">Pertanyaan Belum Diambil</p>
                  <p className="text-sm text-yellow-700">
                    Pertanyaan ini belum ada yang menangani. Ambil untuk mulai membantu pasien.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleAssignToSelf}
                className="bg-emerald-600 hover:bg-emerald-700 shadow-md"
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Ambil Pertanyaan
              </Button>
            </div>
          </Card>
        )}

        {question.assigned_nakes && !isAssignedToMe && (
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 shadow-lg">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-semibold text-purple-900">Sudah Ditangani</p>
                <p className="text-sm text-purple-700">
                  Pertanyaan ini sedang ditangani oleh <strong>{question.assigned_nakes.nama}</strong>
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Question Card */}
        <Card className="p-8 border-none shadow-2xl bg-white">
          {/* Status & Actions */}
          <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <Badge
                style={{
                  backgroundColor: question.category.color,
                  color: "white",
                }}
                className="shadow-sm"
              >
                {question.category.icon} {question.category.name}
              </Badge>
            </div>
            <div className="flex gap-2">
              {isAssignedToMe && !question.is_locked && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCloseQuestion}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Lock className="w-4 h-4 mr-1" />
                  Tutup Pertanyaan
                </Button>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{question.title}</h1>

          {/* Patient Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {question.user.nama.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 flex items-center gap-2">
                {question.user.nama}
                <Badge variant="outline" className="text-xs">Pasien</Badge>
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(question.created_at)}
              </p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div className="flex items-center gap-2 justify-end">
                <Eye className="w-4 h-4" />
                <span>{question.view_count} dilihat</span>
              </div>
              <div className="flex items-center gap-2 justify-end mt-1">
                <MessageSquare className="w-4 h-4" />
                <span>{question.reply_count} jawaban</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {question.content}
              </p>
            </div>
          </div>

          {/* Assigned Info */}
          {question.assigned_nakes && (
            <div className={`border-l-4 p-4 rounded-lg ${
              isAssignedToMe 
                ? "bg-emerald-50 border-emerald-500" 
                : "bg-purple-50 border-purple-500"
            }`}>
              <div className="flex items-center gap-2">
                <Stethoscope className={`w-5 h-5 ${
                  isAssignedToMe ? "text-emerald-700" : "text-purple-700"
                }`} />
                <p className={isAssignedToMe ? "text-emerald-700" : "text-purple-700"}>
                  <span className="font-semibold">Ditangani oleh:</span>{" "}
                  {question.assigned_nakes.nama}
                  {isAssignedToMe && " (Anda)"}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Answer Form */}
        {canAnswer && (
          <Card className="p-8 border-none shadow-xl bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Send className="w-6 h-6 text-emerald-600" />
              Kirim Jawaban Profesional
            </h2>

            <form onSubmit={handleSubmitAnswer}>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border-2 border-emerald-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Jawaban Anda untuk Pasien
                </label>
                <Textarea
                  placeholder="Berikan jawaban yang detail, profesional, dan membantu pasien memahami kondisinya dengan baik..."
                  rows={10}
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  className="mb-4 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                  disabled={submitting}
                  required
                />
                <div className="bg-white p-4 rounded-lg border border-emerald-200 mb-4">
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Tips Memberikan Jawaban:</strong>
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Gunakan bahasa yang mudah dipahami pasien</li>
                    <li>• Berikan penjelasan yang detail namun tidak menakuti</li>
                    <li>• Sertakan saran tindakan yang bisa dilakukan</li>
                    <li>• Jika perlu, sarankan untuk konsultasi langsung</li>
                  </ul>
                </div>
                <Button
                  type="submit"
                  disabled={submitting || !answerContent.trim()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-semibold shadow-lg hover:shadow-xl transition-all w-full h-12"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Mengirim Jawaban...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Jawaban ke Pasien
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Locked Message */}
        {question.is_locked && (
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-500 shadow-lg">
            <div className="flex items-center gap-3 text-gray-700">
              <Lock className="w-6 h-6" />
              <div>
                <p className="font-semibold">Pertanyaan Telah Ditutup</p>
                <p className="text-sm">Tidak dapat menambahkan jawaban baru.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Previous Answers */}
        {question.replies.length > 0 && (
          <Card className="p-8 border-none shadow-xl bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              Riwayat Jawaban ({question.replies.length})
            </h2>

            <div className="space-y-6">
              {question.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border-2 border-emerald-200"
                >
                  {/* Answer Header */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-emerald-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white shadow-lg">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 flex items-center gap-2">
                        {reply.user.nama}
                        <Badge className="bg-emerald-600 text-white text-xs">
                          {reply.responder_role === "nakes" ? "Tenaga Kesehatan" : "Admin"}
                        </Badge>
                        {reply.user.id === currentUser?.id && (
                          <Badge variant="outline" className="text-xs">Anda</Badge>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatRelativeTime(reply.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Answer Content */}
                  <div className="prose max-w-none">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* No Answers Yet */}
        {question.replies.length === 0 && question.assigned_nakes && !canAnswer && (
          <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 border-none shadow-lg">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Belum ada jawaban untuk pertanyaan ini</p>
          </Card>
        )}
      </div>
    </div>
  );
}