"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

type Review = {
  soal_id: number;
  teks: string;
  tipe: string;
  user_answer_text: string;
  user_score: number;
  correct_answer_text: string;
  correct_score: number;
  is_correct: boolean;
};

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<any>(null);
  const [review, setReview] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, []);

  async function loadDetail() {
    try {
      const response = await api.get(`/quiz/history/${params.id}`);
      setSubmission(response.data.submission);
      setReview(response.data.review);
    } catch (error) {
      console.error("Error loading detail:", error);
      alert("Gagal memuat detail hasil quiz");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Data tidak ditemukan</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{submission.bank_name}</h1>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-emerald-600">{submission.percentage}%</div>
              <div className="text-sm text-gray-600">Persentase</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{submission.total_score}</div>
              <div className="text-sm text-gray-600">Skor Kamu</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-600">{submission.max_score}</div>
              <div className="text-sm text-gray-600">Skor Maksimal</div>
            </div>
          </div>
        </div>

        {/* Review Soal */}
        <div className="space-y-4">
          {review.map((item, index) => (
            <div key={item.soal_id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.teks}</h3>
                </div>
              </div>

              {/* Jawaban User */}
              <div className={`border-2 rounded-lg p-4 mb-3 ${item.is_correct ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start gap-2">
                  {item.is_correct ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700 mb-1">Jawaban Kamu:</div>
                    <div className="font-medium text-gray-900">{item.user_answer_text}</div>
                    <div className="text-sm text-gray-600 mt-1">Skor: {item.user_score}</div>
                  </div>
                </div>
              </div>

              {/* Jawaban Benar */}
              {!item.is_correct && (
                <div className="border-2 border-emerald-200 bg-emerald-50 rounded-lg p-4">
                  <div className="text-sm font-semibold text-emerald-700 mb-1">✅ Jawaban Terbaik:</div>
                  <div className="font-medium text-gray-900">{item.correct_answer_text}</div>
                  <div className="text-sm text-emerald-600 mt-1">Skor maksimal: {item.correct_score}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}