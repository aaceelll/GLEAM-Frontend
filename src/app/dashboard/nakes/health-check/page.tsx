"use client";

import React, { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import ScreeningResultModal, { ScreeningResultUI } from "@/components/nakes/screening-result-modal";

/** ===== Types ===== */
interface Patient {
  id: number;
  nama: string;
  umur: number;
  jenis_kelamin: string;
  riwayat_pelayanan_kesehatan?: string;
  riwayat_penyakit_jantung?: string;
  riwayat_merokok?: string;
  bmi?: number;
  indeks_bmi?: number;
}

/** Map smoking history ke format yang tepat sesuai error API */
function mapSmoke(s: string): string {
  const v = (s || "").toLowerCase();
  if (v.includes("tidak") && v.includes("pernah")) return "tidak pernah merokok";
  if (v.includes("mantan") || v.includes("former")) return "mantan perokok";
  if (v.includes("aktif") || v.includes("current")) return "perokok aktif";
  if (v.includes("pernah") && v.includes("tidak jelas")) return "pernah merokok (riwayat tidak jelas)";
  if (v.includes("tidak") && v.includes("saat ini")) return "tidak merokok saat ini";
  return "tidak ada informasi";
}

/** Panggil predictor */
async function callPredictor(data: any) {
  const url = "https://tcnisaa-prediksi-dm-adaboost.hf.space/predict";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const txt = await response.text();
  if (!response.ok) throw new Error(`API error (${response.status}): ${txt}`);
  try {
    return JSON.parse(txt);
  } catch {
    return { raw: txt };
  }
}

export default function HealthCheckPage() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // ==== UI Modal Hasil
  const [openResult, setOpenResult] = useState(false);
  const [resultData, setResultData] = useState<ScreeningResultUI | null>(null);

  const [formData, setFormData] = useState({
    jenis_kelamin: "",
    umur: "",
    tekanan_sistol: "",
    tekanan_diastol: "",
    klasifikasi_hipertensi: "",
    riwayat_penyakit_jantung: "",
    riwayat_merokok: "",
    bmi: "",
    gula_darah: "",
  });

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/patients/search?q=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();
      setSearchResults(data?.patients || []);
    } catch (e) {
      console.error("Error searching patients:", e);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectPatient = (p: Patient) => {
    setSelectedPatient(p);
    setSearchResults([]);
    setSearchTerm("");

    const ageValue = p.umur ? String(parseInt(String(p.umur), 10)) : "";
    const bmiValue =
      (p.bmi ?? p.indeks_bmi) ? String(parseFloat(String(p.bmi ?? p.indeks_bmi))) : "";

    setFormData({
      jenis_kelamin: p.jenis_kelamin || "",
      umur: ageValue,
      tekanan_sistol: "",
      tekanan_diastol: "",
      klasifikasi_hipertensi: "",
      riwayat_penyakit_jantung: p.riwayat_penyakit_jantung || "",
      riwayat_merokok: p.riwayat_merokok || "",
      bmi: bmiValue,
      gula_darah: "",
    });
  };

  const clearSelection = () => {
    setSelectedPatient(null);
    setFormData({
      jenis_kelamin: "",
      umur: "",
      tekanan_sistol: "",
      tekanan_diastol: "",
      klasifikasi_hipertensi: "",
      riwayat_penyakit_jantung: "",
      riwayat_merokok: "",
      bmi: "",
      gula_darah: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "tekanan_sistol" || field === "tekanan_diastol") {
      const sistol = field === "tekanan_sistol" ? parseFloat(value) : parseFloat(formData.tekanan_sistol);
      const diastol = field === "tekanan_diastol" ? parseFloat(value) : parseFloat(formData.tekanan_diastol);
      if (!isNaN(sistol) && !isNaN(diastol) && sistol > 0 && diastol > 0) {
        let klas = "";
        if (sistol < 120 && diastol < 80) klas = "Optimal";
        else if (sistol <= 129 && diastol <= 84) klas = "Normal";
        else if (sistol <= 139 && diastol <= 89) klas = "Normal Tinggi (Pra Hipertensi)";
        else if (sistol <= 159 && diastol <= 99) klas = "Hipertensi Derajat 1";
        else if (sistol <= 179 && diastol <= 109) klas = "Hipertensi Derajat 2";
        else if (sistol >= 180 || diastol >= 110) klas = "Hipertensi Derajat 3";
        else if (sistol >= 140 && diastol < 90) klas = "Hipertensi Sistolik Terisolasi";
        setFormData((prev) => ({ ...prev, klasifikasi_hipertensi: klas }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!selectedPatient) {
        alert("Pilih pasien dahulu.");
        return;
      }
      const age = parseInt(formData.umur, 10);
      const systolic_bp = parseFloat(formData.tekanan_sistol);
      const diastolic_bp = parseFloat(formData.tekanan_diastol);
      const bmi = parseFloat(formData.bmi);
      const blood_glucose_level = parseFloat(formData.gula_darah);
      if (!age || isNaN(age) || age <= 0) throw new Error("Umur tidak valid.");
      if (isNaN(systolic_bp) || systolic_bp <= 0) throw new Error("Tekanan darah sistol tidak valid.");
      if (isNaN(diastolic_bp) || diastolic_bp <= 0) throw new Error("Tekanan darah diastol tidak valid.");
      if (isNaN(bmi) || bmi <= 0) throw new Error("BMI tidak valid. Pastikan data profil lengkap.");
      if (isNaN(blood_glucose_level) || blood_glucose_level <= 0) throw new Error("Gula darah tidak valid.");
      if (!formData.riwayat_penyakit_jantung) throw new Error("Riwayat penyakit jantung belum tersedia di profil.");
      if (!formData.riwayat_merokok) throw new Error("Riwayat merokok belum tersedia di profil.");

      const gender = formData.jenis_kelamin;
      const heart_disease = formData.riwayat_penyakit_jantung;
      const smoking_history = mapSmoke(formData.riwayat_merokok);

      const payload = {
        age,
        gender,
        systolic_bp,
        diastolic_bp,
        heart_disease,
        smoking_history,
        bmi,
        blood_glucose_level,
      };

      const pred = await callPredictor(payload);

      const prob =
        pred?.probabilitas_diabetes ??
        pred?.diabetes_probability ??
        pred?.data?.[0] ??
        null;

      const hasil =
        pred?.hasil_diabetes ??
        pred?.diabetes_result ??
        pred?.data?.[1] ??
        null;

      if (prob === null || hasil === null) {
        throw new Error("Prediksi gagal. Format response tidak dikenali.");
      }

      const bpClass =
        pred?.tekanan_darah?.klasifikasi ??
        pred?.bp_classification ??
        formData.klasifikasi_hipertensi;

      const bpRek =
        pred?.tekanan_darah?.rekomendasi ??
        pred?.bp_recommendation ??
        "";

      // Simpan ke DB (Next API kamu)
      const saveRes = await fetch("/api/screenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: selectedPatient.nama,
          userId: selectedPatient.id,
          nakesId: 1,
          age,
          gender,
          systolic_bp,
          diastolic_bp,
          heart_disease,
          smoking_history,
          bmi,
          blood_glucose_level,
          diabetes_probability: String(prob),
          diabetes_result: String(hasil),
          bp_classification: bpClass,
          bp_recommendation: bpRek,
          full_result: pred,
        }),
      });
      if (!saveRes.ok) {
        const errorText = await saveRes.text();
        throw new Error(`Gagal simpan screening: ${errorText}`);
      }

      // Set data ke modal & buka
      setResultData({
        patient_name: selectedPatient?.nama || "Unknown",
        age,
        bmi,
        systolic_bp,
        diastolic_bp,
        diabetes_probability: `${prob}%`,
        diabetes_result: hasil,
        bp_classification: bpClass,
        bp_recommendation: bpRek,
        created_at: new Date().toISOString(),
      });
      setOpenResult(true);

      // opsional: reset form
      // clearSelection();
    } catch (error: any) {
      console.error("=== Error Submit ===", error);
      alert(error?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Form Screening Diabetes</h1>

          {!selectedPatient ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Pasien</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Ketik nama pasien..."
                />
              </div>

              {searchResults.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                  {searchResults.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => selectPatient(patient)}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <p className="font-medium text-gray-800">{patient.nama}</p>
                      <p className="text-sm text-gray-600">
                        {patient.umur} tahun • {patient.jenis_kelamin}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {isSearching && (
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mencari...
                </p>
              )}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Data Pasien Terpilih:</p>
                  <p className="font-semibold text-lg text-blue-800">{selectedPatient.nama}</p>
                  <p className="text-sm text-blue-700">Usia: {selectedPatient.umur} tahun</p>
                  <p className="text-sm text-blue-700">Jenis Kelamin: {selectedPatient.jenis_kelamin}</p>
                </div>
                <button
                  onClick={clearSelection}
                  className="text-blue-600 hover:text-blue-800 p-2 transition-colors"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin *</label>
                <input
                  type="text"
                  value={formData.jenis_kelamin}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-green-50 text-gray-700"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Umur (tahun) *</label>
                <input
                  type="text"
                  value={formData.umur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-green-50 text-gray-700"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tekanan Darah Sistol (mmHg) *</label>
                <input
                  type="number"
                  value={formData.tekanan_sistol}
                  onChange={(e) => handleChange("tekanan_sistol", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="120"
                  required
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tekanan Darah Diastol (mmHg) *</label>
                <input
                  type="number"
                  value={formData.tekanan_diastol}
                  onChange={(e) => handleChange("tekanan_diastol", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="80"
                  required
                  min={1}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Klasifikasi Hipertensi (Otomatis)</label>
              <input
                type="text"
                value={formData.klasifikasi_hipertensi}
                className="w-full px-4 py-2.5 border border-red-300 bg-red-50 text-red-800 font-medium rounded-lg"
                readOnly
                placeholder="Akan terisi otomatis"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Riwayat Penyakit Jantung *</label>
                <input
                  type="text"
                  value={formData.riwayat_penyakit_jantung}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-green-50 text-gray-700"
                  readOnly
                  placeholder="Data dari profil"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Riwayat Merokok *</label>
                <input
                  type="text"
                  value={formData.riwayat_merokok}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-green-50 text-gray-700"
                  readOnly
                  placeholder="Data dari profil"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BMI (Body Mass Index) *</label>
              <input
                type="text"
                value={formData.bmi}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-green-50 text-gray-700"
                readOnly
                placeholder="Data dari profil"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gula Darah Sewaktu (mg/dL) *</label>
              <input
                type="number"
                value={formData.gula_darah}
                onChange={(e) => handleChange("gula_darah", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="170"
                required
                min={1}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  clearSelection();
                  setSearchTerm("");
                }}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading || !selectedPatient}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Lakukan Screening"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== Modal Hasil (UI popup elegan) ===== */}
      <ScreeningResultModal
        open={openResult}
        onClose={() => setOpenResult(false)}
        result={resultData}
        onNewScreening={() => {
          setOpenResult(false);
          clearSelection();
        }}
      />
    </div>
  );
}
