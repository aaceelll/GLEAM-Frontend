"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

type QuizResult = {
  total_score: number;
  max_score: number;
  percentage: number;
  tipe: "pre" | "post";
};

export default function KuisionerPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [soal, setSoal] = useState<any[]>([]);
  const [bankName, setBankName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submitting, setSubmitting] = useState(false);

  // modal state
  const [modal, setModal] = useState<{
    open: boolean;
    tone: "success" | "warn" | "error";
    title: string;
    desc?: string;
    result?: QuizResult;
  }>({ open: false, tone: "success", title: "" });

  useEffect(() => {
    loadSoal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function loadSoal() {
    try {
      const res = await api.get(`/materi/tes-by-bank/${params.id}`);
      setSoal(res.data.soal || []);
      setBankName(res.data.nama || "");
    } catch (err) {
      setModal({
        open: true,
        tone: "error",
        title: "Gagal memuat soal",
        desc: "Silakan coba beberapa saat lagi.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(soalId: number, value: any) {
    setAnswers((prev) => ({ ...prev, [soalId]: value }));
  }

  const progressPct =
    soal.length > 0 ? (Object.keys(answers).length / soal.length) * 100 : 0;

  function handleNext() {
    if (currentIndex < soal.length - 1) setCurrentIndex((i) => i + 1);
  }
  function handlePrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  async function handleSubmit() {
    const allAnswered = Object.keys(answers).length === soal.length;
    if (!allAnswered) {
      const unanswered = soal.length - Object.keys(answers).length;
      setModal({
        open: true,
        tone: "warn",
        title: "Masih ada soal yang belum dijawab",
        desc: `Tersisa ${unanswered} soal lagi. Lengkapi semuanya sebelum submit, ya.`,
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/quiz/submit", {
        bank_id: params.id,
        answers,
      });
      const result: QuizResult = response.data.data;

      setModal({
      open: true,
      tone: "success",
      title: "Quiz selesai!",
      desc: undefined,
      result: {
        total_score: response.data.data.total_score,
        max_score: response.data.data.max_score,
        percentage: response.data.data.percentage,
        tipe: response.data.data.tipe, // "pre" | "post"
      },
    });
    } catch (error: any) {
      setModal({
        open: true,
        tone: "error",
        title: "Gagal submit quiz",
        desc: error?.response?.data?.message || "Terjadi kesalahan tak terduga.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }
  if (soal.length === 0) {
    return (
      <div className="min-h-screen bg-white px-6 md:px-10 py-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <div className="bg-white/80 rounded-3xl border-2 border-gray-100 shadow-xl p-8 text-center">
            Tidak ada soal.
          </div>
        </div>
      </div>
    );
  }

  const currentSoal = soal[currentIndex];

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{bankName}</h1>
            <p className="text-gray-600">Soal {currentIndex + 1} dari {soal.length}</p>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>
                  {Object.keys(answers).length}/{soal.length} dijawab
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentSoal.teks}
            </h2>

            {/* Opsi pilihan ganda */}
            {currentSoal.tipe === "pilihan_ganda" && currentSoal.opsi && (
              <div className="space-y-3">
                {currentSoal.opsi.map((opsi: any) => {
                  const checked = answers[currentSoal.id] === opsi.no;
                  return (
                    <label
                      key={opsi.no}
                      className={[
                        "flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                        checked
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name={`soal-${currentSoal.id}`}
                        value={opsi.no}
                        checked={checked}
                        onChange={() => handleAnswer(currentSoal.id, opsi.no)}
                        className="w-5 h-5 accent-emerald-600"
                      />
                      <span className="text-gray-800">{opsi.teks}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Jawaban bebas (screening) */}
            {currentSoal.tipe === "screening" && (
              <textarea
                className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-400 focus:ring-0"
                rows={5}
                placeholder="Tuliskan jawaban Anda…"
                value={answers[currentSoal.id] || ""}
                onChange={(e) => handleAnswer(currentSoal.id, e.target.value)}
              />
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-5 py-2.5 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Sebelumnya
              </button>

              {currentIndex < soal.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow"
                >
                  Selanjutnya
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow disabled:opacity-60"
                >
                  {submitting ? "Mengirim..." : "Selesai"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white border-2 border-gray-100 shadow-2xl overflow-hidden">
            <div
              className={[
                "px-6 py-4 border-b-2",
                modal.tone === "success" && "bg-emerald-50 border-emerald-100",
                modal.tone === "warn" && "bg-amber-50 border-amber-100",
                modal.tone === "error" && "bg-rose-50 border-rose-100",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                {modal.tone === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      modal.tone === "warn" ? "text-amber-600" : "text-rose-600"
                    }`}
                  />
                )}
                <h3 className="text-lg font-bold text-gray-900">{modal.title}</h3>
              </div>
            </div>

            <div className="px-6 py-5">
            {modal.result ? (
              <ul className="space-y-2 text-gray-800">
                <li>
                  <span className="text-gray-600">Skor</span>:{" "}
                  <strong>{modal.result.total_score}/{modal.result.max_score}</strong>
                </li>
                <li>
                  <span className="text-gray-600">Persentase</span>:{" "}
                  <strong>{modal.result.percentage}%</strong>
                </li>
                <li>
                  <span className="text-gray-600">Tipe</span>:{" "}
                  <strong>{modal.result.tipe === "pre" ? "Pre Test" : "Post Test"}</strong>
                </li>
              </ul>
            ) : (
              modal.desc && <p className="text-gray-700">{modal.desc}</p>
            )}
          </div>


            <div className="px-6 py-4 border-t-2 border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setModal((m) => ({ ...m, open: false }));
                  if (modal.tone === "success") {
                    // selesai -> ke riwayat
                    router.push("/dashboard/user/riwayat");
                  }
                }}
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
