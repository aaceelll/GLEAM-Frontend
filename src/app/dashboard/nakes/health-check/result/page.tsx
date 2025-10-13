"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ScreeningResultModal, { ScreeningResultUI } from "@/components/nakes/screening-result-modal";

function ScreeningResultContent() {
  const [open, setOpen] = useState(false);

  const dummyResult: ScreeningResultUI = {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Hasil Screening Pasien
          </h1>
          <p className="text-gray-600">
            Klik tombol di bawah untuk membuka hasil screening.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md"
          >
            Lihat Hasil Screening
          </Button>
        </div>
      </div>

      <ScreeningResultModal
        open={open}
        onClose={() => setOpen(false)}
        result={dummyResult}
        onNewScreening={() => alert("Navigasi ke halaman screening baru")}
      />
    </div>
  );
}

export default function Page() {
  return <ScreeningResultContent />;
}