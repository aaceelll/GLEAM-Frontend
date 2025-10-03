"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Heart, Activity, Droplet, Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ScreeningResult {
  id: number;
  patient_name: string;
  age: number;
  gender: string;
  systolic_bp: number;
  diastolic_bp: number;
  heart_disease: string;
  smoking_history: string;
  bmi: number;
  blood_glucose_level: number;
  diabetes_probability: string;
  diabetes_result: string;
  bp_classification: string;
  bp_recommendation: string;
  created_at: string;
}

export default function ResultPage() {
  const [latestResult, setLatestResult] = useState<ScreeningResult | null>(null);
  const [historyResults, setHistoryResults] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/screenings/latest");
        const d = await r.json();
        setLatestResult(d?.latest || null);
        setHistoryResults(d?.history || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getRiskColor = (p: string) => {
    const v = parseFloat(p);
    if (v >= 63) return "text-red-700 bg-red-50 border-red-200";
    if (v >= 48) return "text-orange-700 bg-orange-50 border-orange-200";
    return "text-green-700 bg-green-50 border-green-200";
  };
  const getRiskBadge = (s: string) => {
    if (s.includes("Risiko")) return "bg-red-100 text-red-800";
    if (s.includes("Sedang")) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-64 flex-shrink-0">
          <Sidebar role="nakes" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Memuat hasil...</p>
        </div>
      </div>
    );
  }

  if (!latestResult) {
    return (
      <div className="flex h-screen">
        <div className="w-64 flex-shrink-0">
          <Sidebar role="nakes" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Tidak ada hasil screening</p>
            <Link href="/dashboard/nakes/health-check" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Kembali ke Form Screening
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar role="nakes" />
      </div>
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-6">
            <Link href="/dashboard/nakes/health-check" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Hasil Screening Diabetes Mellitus</h1>
            <p className="text-gray-600">Dashboard hasil screening dan riwayat pemeriksaan</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Hasil Screening</h2>
                  <p className="text-sm text-gray-600">
                    {new Date(latestResult.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <button onClick={() => window.print()} className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50">
                Cetak Hasil
              </button>
            </div>

            {/* Info pasien */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Data Pasien</h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-blue-700 mb-1">PASIEN</p>
                  <p className="font-semibold text-blue-900">{latestResult.patient_name}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 mb-1">USIA</p>
                  <p className="font-semibold text-blue-900">{latestResult.age} tahun</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 mb-1">BMI</p>
                  <p className="font-semibold text-blue-900">{latestResult.bmi}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 mb-1">TEKANAN DARAH</p>
                  <p className="font-semibold text-blue-900">
                    {latestResult.systolic_bp}/{latestResult.diastolic_bp}
                  </p>
                </div>
              </div>
            </div>

            {/* Ringkasan hasil */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className={`rounded-xl p-6 border-2 ${getRiskColor(latestResult.diabetes_probability)}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Droplet className="w-5 h-5" />
                  <h3 className="font-semibold">Berisiko Diabetes</h3>
                </div>
                <p className="text-xs mb-2">Tingkat Risiko: {latestResult.diabetes_result}</p>
                <p className="text-4xl font-bold mb-2">{latestResult.diabetes_probability}</p>
                <div className="mt-4 bg-white bg-opacity-50 rounded-lg p-3">
                  <p className="text-xs font-medium mb-1">Data Screening:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Gula Darah:</span>
                      <span className="font-semibold ml-1">{latestResult.blood_glucose_level} mg/dL</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Klasifikasi:</span>
                      <span className="font-semibold ml-1">
                        {latestResult.blood_glucose_level < 140 ? "Rendah" : "Tinggi"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-900">Data Screening Hipertensi</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Sistolik</p>
                    <p className="text-2xl font-bold text-gray-800">{latestResult.systolic_bp}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Diastolik</p>
                    <p className="text-2xl font-bold text-gray-800">{latestResult.diastolic_bp}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-600 mb-1">Klasifikasi Hipertensi:</p>
                  <p className="font-semibold text-red-700">{latestResult.bp_classification}</p>
                </div>
              </div>
            </div>

            {/* Info tambahan */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Riwayat Penyakit Jantung</p>
                <p className="text-lg font-semibold text-gray-800">{latestResult.heart_disease}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Riwayat Merokok</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">{latestResult.smoking_history}</p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <div className="text-2xl">💡</div>
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 mb-2">Rekomendasi:</p>
                  <p className="text-sm text-blue-800">{latestResult.bp_recommendation}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <p className="font-semibold text-yellow-900 mb-1">Disclaimer:</p>
                  <p className="text-sm text-yellow-800">
                    Hasil ini hanya prediksi dan tidak menggantikan diagnosis medis profesional.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-800">Riwayat Screening</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                      TANGGAL
                    </th>
                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                      BMI
                    </th>
                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                      GULA DARAH
                    </th>
                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                      TEKANAN DARAH
                    </th>
                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                      HASIL
                    </th>
                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                      SKOR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historyResults.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 text-sm text-gray-800">
                        {new Date(r.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4 text-sm text-gray-800">{r.bmi}</td>
                      <td className="py-4 text-sm text-gray-800">{r.blood_glucose_level} mg/dL</td>
                      <td className="py-4 text-sm text-gray-800">
                        {r.systolic_bp}/{r.diastolic_bp}
                        <div className="text-xs text-gray-500">{r.bp_classification}</div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRiskBadge(r.diabetes_result)}`}>
                          {r.diabetes_result.includes("Tidak")
                            ? "Rendah"
                            : r.diabetes_result.includes("Sedang")
                            ? "Sedang"
                            : "Tinggi"}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-semibold text-gray-800">
                        {r.diabetes_probability}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {historyResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Belum ada riwayat screening sebelumnya
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
