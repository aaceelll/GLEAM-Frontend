"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ScreeningResultModal, { ScreeningResultUI } from "@/components/nakes/screening-result-modal";

export default function HealthCheckResultPage() {
  const [open, setOpen] = useState(false);

  // Simulasi hasil (ganti nanti dengan API fetch)
  const result: ScreeningResultUI = {
    patient_name: "Rachel Savitri",
    age: 22,
    bmi: 23.5,
    systolic_bp: 145,
    diastolic_bp: 85,
    diabetes_probability: "52.3%",
    diabetes_result: "Kemungkinan tinggi terkena diabetes berdasarkan hasil model.",
    bp_classification: "Hipertensi Derajat 1",
    bp_recommendation: "Konsultasikan dengan dokter dan ubah gaya hidup menjadi lebih sehat.",
    created_at: new Date().toISOString(),
  };

  const handleClose = () => setOpen(false);
  const handleNewScreening = () => {
    setOpen(false);
    alert("Navigasi ke halaman screening pasien baru...");
  };

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hasil Screening Pasien</h1>

      <p className="text-gray-700 mb-4">
        Klik tombol di bawah untuk melihat hasil screening pasien.
      </p>

      <Button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        Lihat Hasil Screening
      </Button>

      <ScreeningResultModal
        open={open}
        onClose={handleClose}
        result={result}
        onNewScreening={handleNewScreening}
      />
    </main>
  );
}
