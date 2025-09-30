"use client";

import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface Patient {
  id: number;
  nama: string;
  umur: number;
  jenis_kelamin: string;
  riwayat_pelayanan_kesehatan?: string;
  riwayat_merokok?: string;
  bmi?: number;
  indeks_bmi?: number;
}

export default function HealthCheckPage() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const [formData, setFormData] = useState({
    jenis_kelamin: '',
    umur: '',
    tekanan_sistol: '',
    tekanan_diastol: '',
    klasifikasi_hipertensi: '',
    riwayat_jantung: '',
    riwayat_merokok: '',
    bmi: '',
    gula_darah: ''
  });

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    console.log('🔍 Searching for:', term);
    
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/patients/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      
      console.log('📦 API Response:', data);
      console.log('👥 Patients found:', data.patients);
      
      setSearchResults(data.patients || []);
    } catch (error) {
      console.error('❌ Error searching patients:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectPatient = (patient: Patient) => {
    console.log('Selected patient:', patient);
    
    setSelectedPatient(patient);
    setSearchResults([]);
    setSearchTerm('');
    
    setFormData({
      jenis_kelamin: patient.jenis_kelamin || '',
      umur: patient.umur?.toString() || '',
      tekanan_sistol: '',
      tekanan_diastol: '',
      klasifikasi_hipertensi: '',
      riwayat_jantung: patient.riwayat_pelayanan_kesehatan || 'Tidak',
      riwayat_merokok: patient.riwayat_merokok || 'tidak pernah merokok',
      bmi: (patient.bmi || patient.indeks_bmi || 0).toString(),
      gula_darah: ''
    });
  };

  const clearSelection = () => {
    setSelectedPatient(null);
    setFormData({
      jenis_kelamin: '',
      umur: '',
      tekanan_sistol: '',
      tekanan_diastol: '',
      klasifikasi_hipertensi: '',
      riwayat_jantung: '',
      riwayat_merokok: '',
      bmi: '',
      gula_darah: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'tekanan_sistol' || field === 'tekanan_diastol') {
      const sistol = field === 'tekanan_sistol' ? parseFloat(value) : parseFloat(formData.tekanan_sistol);
      const diastol = field === 'tekanan_diastol' ? parseFloat(value) : parseFloat(formData.tekanan_diastol);
      
      if (sistol && diastol) {
        let klasifikasi = '';
        if (sistol < 120 && diastol < 80) klasifikasi = 'Optimal';
        else if (sistol <= 129 && diastol <= 84) klasifikasi = 'Normal';
        else if (sistol <= 139 && diastol <= 89) klasifikasi = 'Normal Tinggi (Pra Hipertensi)';
        else if (sistol <= 159 && diastol <= 99) klasifikasi = 'Hipertensi Derajat 1';
        else if (sistol <= 179 && diastol <= 109) klasifikasi = 'Hipertensi Derajat 2';
        else if (sistol >= 180 || diastol >= 110) klasifikasi = 'Hipertensi Derajat 3';
        else if (sistol >= 140 && diastol < 90) klasifikasi = 'Hipertensi Sistolik Terisolasi';
        
        setFormData(prev => ({ ...prev, klasifikasi_hipertensi: klasifikasi }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://tcnisaa-prediksi-dm-adaboost.hf.space/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formData.umur),
          gender: formData.jenis_kelamin,
          systolic_bp: parseFloat(formData.tekanan_sistol),
          diastolic_bp: parseFloat(formData.tekanan_diastol),
          heart_disease: formData.riwayat_jantung,
          smoking_history: formData.riwayat_merokok,
          bmi: parseFloat(formData.bmi),
          blood_glucose_level: parseFloat(formData.gula_darah)
        })
      });

      const resultData = await response.json();
      
      await fetch('/api/screenings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: selectedPatient?.nama || 'Unknown',
          userId: selectedPatient?.id,
          nakesId: 1,
          age: formData.umur,
          gender: formData.jenis_kelamin,
          systolic_bp: formData.tekanan_sistol,
          diastolic_bp: formData.tekanan_diastol,
          heart_disease: formData.riwayat_jantung,
          smoking_history: formData.riwayat_merokok,
          bmi: formData.bmi,
          blood_glucose_level: formData.gula_darah,
          diabetes_probability: resultData.probabilitas_diabetes,
          diabetes_result: resultData.hasil_diabetes,
          bp_classification: resultData.tekanan_darah?.klasifikasi,
          bp_recommendation: resultData.tekanan_darah?.rekomendasi,
          full_result: resultData.hasil_lengkap
        })
      });

      alert(`Hasil: ${resultData.probabilitas_diabetes} - ${resultData.hasil_diabetes}`);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan');
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="Namira Nurfaliani"
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
                      <p className="text-sm text-gray-600">{patient.umur} tahun • {patient.jenis_kelamin}</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Jenis Kelamin *</label>
                <input
                  type="text"
                  value={formData.jenis_kelamin}
                  className="w-full px-4 py-2.5 border rounded-lg bg-green-50"
                  readOnly
                  disabled={!!selectedPatient}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Umur (tahun) *</label>
                <input
                  type="number"
                  value={formData.umur}
                  className="w-full px-4 py-2.5 border rounded-lg bg-green-50"
                  readOnly
                  disabled={!!selectedPatient}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tekanan Darah Sistol (mmHg) *</label>
                <input
                  type="number"
                  value={formData.tekanan_sistol}
                  onChange={(e) => handleChange('tekanan_sistol', e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tekanan Darah Diastol (mmHg) *</label>
                <input
                  type="number"
                  value={formData.tekanan_diastol}
                  onChange={(e) => handleChange('tekanan_diastol', e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Klasifikasi Hipertensi (Auto)</label>
              <input
                type="text"
                value={formData.klasifikasi_hipertensi}
                className="w-full px-4 py-2.5 border border-red-300 bg-red-50 text-red-800 font-medium rounded-lg"
                readOnly
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Riwayat Penyakit Jantung *</label>
                <input
                  type="text"
                  value={formData.riwayat_jantung}
                  className="w-full px-4 py-2.5 border rounded-lg bg-green-50"
                  readOnly
                  disabled={!!selectedPatient}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Riwayat Merokok *</label>
                <input
                  type="text"
                  value={formData.riwayat_merokok}
                  className="w-full px-4 py-2.5 border rounded-lg bg-green-50"
                  readOnly
                  disabled={!!selectedPatient}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">BMI *</label>
              <input
                type="text"
                value={formData.bmi}
                className="w-full px-4 py-2.5 border rounded-lg bg-green-50"
                readOnly
                disabled={!!selectedPatient}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gula Darah Sewaktu (mg/dL) *</label>
              <input
                type="number"
                value={formData.gula_darah}
                onChange={(e) => handleChange('gula_darah', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg"
                placeholder="170"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  clearSelection();
                  setSearchTerm('');
                }}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Lakukan Screening'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}