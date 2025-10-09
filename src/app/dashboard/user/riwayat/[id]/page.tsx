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
    (async () => {
      try {
        const response = await api.get(`/quiz/history/${params.id}`);
        setSubmission(response.data.submission);
        setReview(response.data.review);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 mt-4">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-gray-600">Data tidak ditemukan</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        {/* Summary card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{submission.bank_name}</h1>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl p-4 text-center border-2 border-emerald-200 bg-emerald-50">
                <div className="text-3xl font-bold text-emerald-600">{submission.percentage}%</div>
                <div className="text-sm text-gray-600">Persentase</div>
              </div>
              <div className="rounded-xl p-4 text-center border-2 border-blue-200 bg-blue-50">
                <div className="text-3xl font-bold text-blue-600">{submission.total_score}</div>
                <div className="text-sm text-gray-600">Skor Kamu</div>
              </div>
              <div className="rounded-xl p-4 text-center border-2 border-gray-200 bg-gray-50">
                <div className="text-3xl font-bold text-gray-700">{submission.max_score}</div>
                <div className="text-sm text-gray-600">Skor Maksimal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-4">
          {review.map((item, index) => (
            <div key={item.soal_id} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 grid place-items-center font-bold">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-900">{item.teks}</h3>
              </div>

              {/* Jawaban user */}
              <div
                className={`border-2 rounded-xl p-4 mb-3 ${
                  item.is_correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  {item.is_correct ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Jawaban Kamu</div>
                    <div className="font-medium text-gray-900">{item.user_answer_text}</div>
                    <div className="text-sm text-gray-600 mt-1">Skor: {item.user_score}</div>
                  </div>
                </div>
              </div>

              {/* Jawaban benar */}
              {!item.is_correct && (
                <div className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-4">
                  <div className="text-sm font-semibold text-emerald-700 mb-1">✅ Jawaban Terbaik</div>
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
