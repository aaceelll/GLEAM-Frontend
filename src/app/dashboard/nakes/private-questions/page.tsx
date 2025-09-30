"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  Stethoscope,
  Calendar,
  User,
  Shield,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Question {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    nama: string;
  };
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
  reply_count: number;
  view_count: number;
  created_at: string;
}

export default function NakesPrivateQuestionsPage() {
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const [myQuestions, setMyQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const [pendingRes, myRes] = await Promise.all([
        api.get("/forum/private/pending"),
        api.get("/forum/private/my-assignments"),
      ]);
      setPendingQuestions(pendingRes.data);
      setMyQuestions(myRes.data);
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToSelf = async (questionId: number) => {
    if (!confirm("Ambil pertanyaan ini untuk dijawab?")) return;

    try {
      await api.post(`/forum/threads/${questionId}/assign`);
      alert("Pertanyaan berhasil diambil! Silakan jawab pertanyaan pasien.");
      loadQuestions();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengambil pertanyaan");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white p-8 rounded-3xl shadow-2xl">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Stethoscope className="w-10 h-10" />
            Pertanyaan Private dari Pasien
          </h1>
          <p className="text-emerald-100 text-lg">
            Bantu pasien dengan menjawab pertanyaan kesehatan mereka secara profesional 💚
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-bold">{pendingQuestions.length}</p>
                <p className="text-yellow-100 text-sm">Pertanyaan Baru</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-bold">{myQuestions.length}</p>
                <p className="text-emerald-100 text-sm">Pertanyaan Saya</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-lime-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {myQuestions.filter((q) => q.reply_count > 0).length}
                </p>
                <p className="text-green-100 text-sm">Sudah Dijawab</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="p-6 border-none shadow-xl bg-white">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-emerald-100 h-14">
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white font-semibold text-base"
              >
                <Clock className="w-5 h-5 mr-2" />
                Pertanyaan Baru ({pendingQuestions.length})
              </TabsTrigger>
              <TabsTrigger
                value="my-questions"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-semibold text-base"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Pertanyaan Saya ({myQuestions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">Memuat pertanyaan...</p>
                </div>
              ) : pendingQuestions.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <Clock className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Tidak ada pertanyaan baru
                  </h3>
                  <p className="text-gray-500">
                    Semua pertanyaan sudah ditangani oleh tenaga kesehatan lain
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingQuestions.map((question) => (
                    <Card
                      key={question.id}
                      className="p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all bg-gradient-to-r from-yellow-50 to-orange-50"
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {question.user.nama.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-yellow-500 text-white">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Baru
                                </Badge>
                                <Badge
                                  style={{
                                    backgroundColor: question.category.color,
                                    color: "white",
                                  }}
                                >
                                  {question.category.icon} {question.category.name}
                                </Badge>
                              </div>
                              <h3 className="font-bold text-lg text-gray-800 mb-2">
                                {question.title}
                              </h3>
                              <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                                {question.content}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                <strong>{question.user.nama}</strong>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {formatRelativeTime(question.created_at)}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Link href={`/dashboard/nakes/private-questions/${question.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Lihat Detail
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                onClick={() => handleAssignToSelf(question.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 shadow-md"
                              >
                                <Stethoscope className="w-4 h-4 mr-1" />
                                Ambil & Jawab
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-questions" className="mt-6">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Memuat...</p>
                </div>
              ) : myQuestions.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <MessageSquare className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Belum ada pertanyaan yang Anda tangani
                  </h3>
                  <p className="text-gray-500">
                    Ambil pertanyaan dari tab "Pertanyaan Baru" untuk mulai membantu pasien
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myQuestions.map((question) => (
                    <Link
                      key={question.id}
                      href={`/dashboard/nakes/private-questions/${question.id}`}
                    >
                      <Card className="p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-r from-emerald-50 to-teal-50">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {question.user.nama.charAt(0).toUpperCase()}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {question.reply_count > 0 ? (
                                    <Badge className="bg-green-500 text-white">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Dijawab
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-yellow-500 text-white">
                                      <Clock className="w-3 h-3 mr-1" />
                                      Belum Dijawab
                                    </Badge>
                                  )}
                                  <Badge
                                    style={{
                                      backgroundColor: question.category.color,
                                      color: "white",
                                    }}
                                  >
                                    {question.category.icon} {question.category.name}
                                  </Badge>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2 hover:text-emerald-600 transition-colors">
                                  {question.title}
                                </h3>
                                <p className="text-gray-700 text-sm line-clamp-2">
                                  {question.content}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                <strong>{question.user.nama}</strong>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {formatRelativeTime(question.created_at)}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MessageSquare className="w-4 h-4" />
                                {question.reply_count} jawaban
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                {question.view_count} dilihat
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}