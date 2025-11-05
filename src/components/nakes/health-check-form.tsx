// src/components/nakes/health-check-form.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface Patient {
  id: number;
  nama: string;
  umur: number;
  jenis_kelamin: string;
}

export default function HealthCheckForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // ✅ TAMBAHKAN: State untuk nakesId
  const [nakesId, setNakesId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    jenis_kelamin: "",
    umur: "",
    tekanan_sistol: "",
    tekanan_diastol: "",
    riwayat_penyakit_jantung: "",
    riwayat_merokok: "",
    bmi: "",
    gula_darah: "",
  });

  // ✅ TAMBAHKAN: Fetch user yang login untuk dapat nakesId
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          console.log('Current user:', data);
          
          // Set nakesId dari user yang login
          if (data.role === 'nakes' || data.role === 'admin') {
            setNakesId(data.id);
            console.log('✅ Nakes ID set to:', data.id);
          } else {
            console.warn('⚠️ User bukan nakes atau admin');
          }
        }
      } catch (error) {
        console.error('❌ Error fetching current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/patients/search?q=${encodeURIComponent(term)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.patients || []);
      }
    } catch (error) {
      console.error("Error searching patients:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchResults([]);
    setSearchTerm("");
    
    setFormData({
      jenis_kelamin: patient.jenis_kelamin || "",
      umur: patient.umur?.toString() || "",
      tekanan_sistol: "",
      tekanan_diastol: "",
      riwayat_penyakit_jantung: "",
      riwayat_merokok: "",
      bmi: "",
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
      riwayat_penyakit_jantung: "",
      riwayat_merokok: "",
      bmi: "",
      gula_darah: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ VALIDASI: Pastikan nakesId sudah ada
    if (!nakesId) {
      alert("Error: Tidak dapat mengidentifikasi nakes. Silakan login ulang.");
      return;
    }

    if (!selectedPatient) {
      alert("Pilih pasien terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      // Call ML API
      const response = await fetch("https://wati1205-api-klasifikasi-dm.hf.space/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(formData.umur),
          gender: formData.jenis_kelamin === "Perempuan" ? 0 : 1,
          systolic_bp: parseFloat(formData.tekanan_sistol),
          diastolic_bp: parseFloat(formData.tekanan_diastol),
          heart_disease: formData.riwayat_penyakit_jantung === "Ya" ? true : false,
          smoking_history: formData.riwayat_merokok?.toLowerCase(),
          bmi: parseFloat(formData.bmi),
          blood_glucose_level: parseFloat(formData.gula_darah),
        }),
      });

      const resultData = await response.json();
      console.log("Result dari API HF:", resultData);

      if (resultData.error) {
        alert("Gagal screening: " + resultData.error);
        setLoading(false);
        return;
      }

      // ✅ FIX: Gunakan nakesId dari state, bukan hardcoded
      console.log('📤 Sending screening with nakesId:', nakesId);
      
      const saveResponse = await fetch("/api/screenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: selectedPatient?.nama || "Unknown",
          userId: selectedPatient?.id,
          nakesId: nakesId,  // ✅ Gunakan ID dari user yang login
          age: formData.umur,
          gender: formData.jenis_kelamin,
          systolic_bp: formData.tekanan_sistol,
          diastolic_bp: formData.tekanan_diastol,
          heart_disease: formData.riwayat_penyakit_jantung,
          smoking_history: formData.riwayat_merokok,
          bmi: formData.bmi,
          blood_glucose_level: formData.gula_darah,
          diabetes_probability: resultData.probabilitas_diabetes,
          diabetes_result: resultData.hasil_diabetes,
          bp_classification: resultData.tekanan_darah?.klasifikasi,
          bp_recommendation: resultData.tekanan_darah?.rekomendasi,
          full_result: resultData.hasil_lengkap,
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        console.error('Error saving screening:', errorData);
        alert("Gagal menyimpan hasil screening: " + (errorData.message || errorData.error));
        setLoading(false);
        return;
      }

      alert(`Hasil: ${resultData.probabilitas_diabetes} - ${resultData.hasil_diabetes}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // ========================= UI =========================
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Form Screening Diabetes</h1>

          {/* Search Patient */}
          {!selectedPatient ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Pasien</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="Cari nama pasien..."
                />
              </div>

              {searchResults.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                  {searchResults.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => selectPatient(patient)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <p className="font-medium text-gray-800">{patient.nama}</p>
                      <p className="text-sm text-gray-600">
                        {patient.umur} tahun • {patient.jenis_kelamin}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              {isSearching && <p className="text-sm text-gray-500 mt-2">Mencari...</p>}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Data Pasien Terpilih:</p>
                  <p className="font-semibold text-lg text-blue-800">Nama: {selectedPatient.nama}</p>
                  <p className="text-sm text-blue-700">Usia: {selectedPatient.umur} tahun</p>
                  <p className="text-sm text-blue-700">Jenis Kelamin: {selectedPatient.jenis_kelamin}</p>
                </div>
                <button onClick={clearSelection} className="text-blue-600 hover:text-blue-800 p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Jenis Kelamin *</label>
                <input
                  type="text"
                  value={formData.jenis_kelamin}
                  className="w-full px-4 py-2.5 border rounded-lg bg-green-50"
                  readOnly
                  disabled={!selectedPatient}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Umur *</label>
                <input
                  type="number"
                  value={formData.umur}
                  className="w-full px-4 py-2.5 border rounded-lg bg-green-50"
                  readOnly
                  disabled={!selectedPatient}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tekanan Sistol (mmHg) *</label>
                <input
                  type="number"
                  value={formData.tekanan_sistol}
                  onChange={(e) => setFormData({ ...formData, tekanan_sistol: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg"
                  required
                  disabled={!selectedPatient}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tekanan Diastol (mmHg) *</label>
                <input
                  type="number"
                  value={formData.tekanan_diastol}
                  onChange={(e) => setFormData({ ...formData, tekanan_diastol: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg"
                  required
                  disabled={!selectedPatient}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Riwayat Penyakit Jantung *</label>
                <select
                  value={formData.riwayat_penyakit_jantung}
                  onChange={(e) => setFormData({ ...formData, riwayat_penyakit_jantung: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg"
                  required
                  disabled={!selectedPatient}
                >
                  <option value="">Pilih</option>
                  <option value="Ya">Ya</option>
                  <option value="Tidak">Tidak</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Riwayat Merokok *</label>
                <select
                  value={formData.riwayat_merokok}
                  onChange={(e) => setFormData({ ...formData, riwayat_merokok: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg"
                  required
                  disabled={!selectedPatient}
                >
                  <option value="">Pilih</option>
                  <option value="tidak pernah">Tidak Pernah</option>
                  <option value="mantan perokok">Mantan Perokok</option>
                  <option value="perokok aktif">Perokok Aktif</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">BMI *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.bmi}
                  onChange={(e) => setFormData({ ...formData, bmi: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg"
                  required
                  disabled={!selectedPatient}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gula Darah (mg/dL) *</label>
                <input
                  type="number"
                  value={formData.gula_darah}
                  onChange={(e) => setFormData({ ...formData, gula_darah: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg"
                  required
                  disabled={!selectedPatient}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={clearSelection}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                disabled={loading}
              >
                Reset
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                disabled={loading || !selectedPatient || !nakesId}
              >
                {loading ? "Memproses..." : "Lakukan Screening"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}