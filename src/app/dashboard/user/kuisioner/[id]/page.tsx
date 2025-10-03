"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function KuisionerPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [soal, setSoal] = useState<any[]>([]);
  const [bankName, setBankName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  useEffect(() => {
    loadSoal();
  }, [params.id]);

  async function loadSoal() {
    try {
      const res = await api.get(`/materi/tes-by-bank/${params.id}`);
      setSoal(res.data.soal || []);
      setBankName(res.data.nama || "");
    } catch (err) {
      console.error(err);
      alert("Gagal memuat soal");
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(soalId: number, value: any) {
    setAnswers(prev => ({ ...prev, [soalId]: value }));
  }

  function handleNext() {
    if (currentIndex < soal.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function handleSubmit() {
    alert("Kuisioner selesai! (Fitur submit belum diimplementasi)");
    router.push("/dashboard/user/diabetes-melitus");
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (soal.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">Tidak ada soal</div>;
  }

  const currentSoal = soal[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-emerald-700">{bankName}</h1>
            <p className="text-gray-600">Soal {currentIndex + 1} dari {soal.length}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{currentSoal.teks}</h2>
            
            {currentSoal.tipe === "pilihan_ganda" && currentSoal.opsi && (
              <div className="space-y-3">
                {currentSoal.opsi.map((opsi: any) => (
                  <label key={opsi.no} className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-emerald-50">
                    <input
                      type="radio"
                      name={`soal-${currentSoal.id}`}
                      value={opsi.no}
                      checked={answers[currentSoal.id] === opsi.no}
                      onChange={() => handleAnswer(currentSoal.id, opsi.no)}
                      className="w-5 h-5"
                    />
                    <span>{opsi.teks}</span>
                  </label>
                ))}
              </div>
            )}

            {currentSoal.tipe === "screening" && (
              <textarea
                className="w-full p-4 border-2 rounded-lg"
                rows={4}
                placeholder="Tuliskan jawaban Anda..."
                value={answers[currentSoal.id] || ""}
                onChange={(e) => handleAnswer(currentSoal.id, e.target.value)}
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Sebelumnya
            </button>
            
            {currentIndex < soal.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg"
              >
                Selanjutnya
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Selesai
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}