"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ClipboardList, Trophy, Calendar, ArrowLeft } from "lucide-react";

type Submission = {
  id: number;
  bank_name: string;
  total_score: number;
  max_score: number;
  percentage: number;
  submitted_at: string;
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

  async function loadHistory() {
    try {
      const response = await api.get('/quiz/history');
      setPreTests(response.data.pre || []);
      setPostTests(response.data.post || []);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  }

  const currentData = activeTab === "pre" ? preTests : postTests;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard/user')}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-800">Riwayat Quiz</h1>
          </div>
          <p className="text-gray-600">Lihat hasil dan review jawaban kamu</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("pre")}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "pre"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              📝 Pre Test
            </button>
            <button
              onClick={() => setActiveTab("post")}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "post"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              ✅ Post Test
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600 mt-4">Memuat riwayat...</p>
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Belum ada riwayat {activeTab === "pre" ? "Pre" : "Post"} Test</p>
                <button
                  onClick={() => router.push('/dashboard/user/diabetes-melitus')}
                  className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Mulai Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/dashboard/user/riwayat/${item.id}`)}
                    className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.bank_name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{item.submitted_at}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-600">{item.percentage}%</div>
                        <div className="text-sm text-gray-600">
                          {item.total_score}/{item.max_score} poin
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}