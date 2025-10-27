"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ClipboardList, Trophy, Calendar } from "lucide-react";

type Submission = {
  id: number;
  bank_name: string;
  total_score: number;
  max_score: number;
  percentage: number;
  submitted_at: string;
  question_count?: number;
  correct_count?: number;
};

export default function RiwayatPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pre" | "post">("pre");
  const [preTests, setPreTests] = useState<Submission[]>([]);
  const [postTests, setPostTests] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function enrichWithCounts(items: Submission[]): Promise<Submission[]> {
    return Promise.all(
      items.map(async (it) => {
        try {
          const res = await api.get(`/quiz/history/${it.id}`);
          const review = Array.isArray(res.data?.review) ? res.data.review : [];
          const total = review.length;
          const correct =
            review.filter((r: any) => r.is_correct === true).length ||
            Math.round((it.percentage / 100) * total);
          return { ...it, question_count: total, correct_count: correct };
        } catch {
          return it;
        }
      })
    );
  }

  async function loadHistory() {
    try {
      const response = await api.get("/quiz/history");
      const preRaw: Submission[] = response.data.pre || [];
      const postRaw: Submission[] = response.data.post || [];
      const [preEnriched, postEnriched] = await Promise.all([
        enrichWithCounts(preRaw),
        enrichWithCounts(postRaw),
      ]);
      setPreTests(preEnriched);
      setPostTests(postEnriched);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  }

  const currentData = activeTab === "pre" ? preTests : postTests;

  return (
        <div className="min-h-screen bg-white px-6 md:px-10 py-9">
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
                    <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
    
                 {/* Judul + subjudul */}
                <div>
                  <h1 className="text-[22px] leading-[1.15] sm:text-3xl md:text-4xl font-bold text-gray-800">
                    Riwayat Quiz<br className="hidden sm:block" />
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-0.5">
                    Lihat Hasil & Review Jawaban Kamu
                  </p>
                </div>
              </div>
            </div>

        {/* ===== Card Section ===== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex gap-3 p-1 bg-white/80 rounded-2xl border-2 border-gray-100 shadow-sm w-full sm:w-fit">
                  <button
                    onClick={() => setActiveTab("pre")}
                    className={`px-4 sm:px-5 py-2 rounded-xl font-semibold transition-all ${
                      activeTab === "pre"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    📝 Pre Test
                  </button>
                  <button
                    onClick={() => setActiveTab("post")}
                    className={`px-4 sm:px-5 py-2 rounded-xl font-semibold transition-all ${
                      activeTab === "post"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    ✅ Post Test
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== List ===== */}
          <div className="px-6 pb-6 pt-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
                <p className="text-gray-600 mt-4">Memuat riwayat...</p>
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  Belum ada riwayat {activeTab === "pre" ? "Pre" : "Post"} Test
                </p>
                <button
                  onClick={() =>
                    router.push("/dashboard/user/diabetes-melitus")
                  }
                  className="mt-4 px-6 py-2 rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow"
                >
                  Mulai Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentData.map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      router.push(`/dashboard/user/riwayat/${item.id}`)
                    }
                    className="group w-full text-left bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-transparent hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                    <div className="flex items-start justify-between relative">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {item.bank_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{item.submitted_at}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-600">
                          {item.percentage}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {typeof item.question_count === "number" &&
                          item.question_count > 0
                            ? `${
                                item.correct_count ??
                                Math.round(
                                  (item.percentage / 100) * item.question_count
                                )
                              }/${item.question_count} soal`
                            : `${item.total_score}/${item.max_score} poin`}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
