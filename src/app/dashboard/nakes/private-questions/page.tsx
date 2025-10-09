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

/* ================ Page =================== */
export default function NakesPrivateQuestionsPage() {
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const [myQuestions, setMyQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "my-questions">("pending");

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
      setPendingQuestions(pendingRes.data);
      setMyQuestions(myRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignToSelf(id: number) {
    if (!confirm("Ambil pertanyaan ini untuk dijawab?")) return;
    try {
      await api.post(`/forum/threads/${id}/assign`);
      alert("Pertanyaan berhasil diambil!");
      loadQuestions();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengambil pertanyaan");
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${greenGrad} flex items-center justify-center shadow-lg`}
          >
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Pertanyaan Private dari Pasien
            </h1>
            <p className="text-gray-600 mt-0.5">
              Jawab Pertanyaan Private Pasien Anda di Sini
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              n: pendingQuestions.length,
              label: "Pertanyaan Baru",
              icon: <Clock className="w-6 h-6" />,
            },
            {
              n: myQuestions.length,
              label: "Pertanyaan Saya",
              icon: <MessageSquare className="w-6 h-6" />,
            },
            {
              n: myQuestions.filter((q) => q.reply_count > 0).length,
              label: "Sudah Dijawab",
              icon: <CheckCircle className="w-6 h-6" />,
            },
          ].map((s, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-white p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                  {s.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{s.n}</p>
                  <p className="text-sm text-gray-600">{s.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs + List */}
        <Card className="rounded-3xl border-2 border-gray-100 shadow-xl">
          <div className="px-6 pt-6">
            <Tabs
              value={tab}
              onValueChange={(v) =>
                setTab((v as "pending" | "my-questions") ?? "pending")
              }
              className="w-full"
            >
              {/* Navigation Pills - Full Width dengan Gap */}
              <div className="flex gap-3 p-1 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-100 shadow-lg mb-6">
                <button
                  onClick={() => setTab("pending")}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300
                  ${tab === "pending"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.03]"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 hover:shadow-md"
                    }`}
                >
                  <Clock className="h-5 w-5" />
                  Pertanyaan Baru
                  <span
                    className={`ml-2 inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full text-xs font-bold ${
                      tab === "pending"
                        ? "bg-white/25 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {pendingQuestions.length}
                  </span>
                </button>

                <button
                  onClick={() => setTab("my-questions")}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300
                  ${tab === "my-questions"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.03]"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 hover:shadow-md"
                    }`}
                >
                  <MessageSquare className="h-5 w-5" />
                  Pertanyaan Saya
                  <span
                    className={`ml-2 inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full text-xs font-bold ${
                      tab === "my-questions"
                        ? "bg-white/25 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {myQuestions.length}
                  </span>
                </button>
              </div>

              {/* PENDING */}
              <TabsContent value="pending" className="pt-6 pb-2">
                {loading ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Memuat pertanyaan…</p>
                  </div>
                ) : pendingQuestions.length === 0 ? (
                  <div className="text-center py-14">
                    <Clock className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-700 font-semibold">
                      Tidak ada pertanyaan baru
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {pendingQuestions.map((q) => (
                      <Card
                        key={q.id}
                        className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-5 hover:border-emerald-300 hover:shadow-xl transition-all"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex gap-4">
                          {/* avatar */}
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow flex-shrink-0">
                            {q.user.nama.charAt(0).toUpperCase()}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge className="bg-emerald-600 text-white">
                                Baru
                              </Badge>
                              <Badge
                                style={{
                                  backgroundColor: q.category.color,
                                  color: "white",
                                }}
                              >
                                {q.category.icon} {q.category.name}
                              </Badge>
                            </div>

                            <h3 className="font-bold text-gray-900 text-lg">
                              {q.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {q.content}
                            </p>

                            <div className="mt-4 flex flex-col gap-3">
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

                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  onClick={() => handleAssignToSelf(q.id)}
                                  className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-px transition-all"
                                >
                                  <Stethoscope className="w-4 h-4 mr-1.5" />
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

              {/* MY QUESTIONS */}
              <TabsContent value="my-questions" className="pt-6 pb-2">
                {loading ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Memuat…</p>
                  </div>
                ) : myQuestions.length === 0 ? (
                  <div className="text-center py-14">
                    <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-700 font-semibold">
                      Belum ada pertanyaan yang Anda tangani
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {myQuestions.map((q) => (
                      <Link
                        key={q.id}
                        href={`/dashboard/nakes/private-questions/${q.id}`}
                      >
                        <Card className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-5 hover:border-emerald-300 hover:shadow-xl transition-all cursor-pointer">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative flex gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow flex-shrink-0">
                              {q.user.nama.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                {q.reply_count > 0 ? (
                                  <Badge className="bg-green-600 text-white">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Dijawab
                                  </Badge>
                                ) : (
                                  <Badge className="bg-emerald-600 text-white">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Belum Dijawab
                                  </Badge>
                                )}
                                <Badge
                                  style={{
                                    backgroundColor: q.category.color,
                                    color: "white",
                                  }}
                                >
                                  {q.category.icon} {q.category.name}
                                </Badge>
                              </div>

                              <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">
                                {q.title}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {q.content}
                              </p>

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
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
}