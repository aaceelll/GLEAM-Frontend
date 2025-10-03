"use client";

import React from "react";
import { X, Activity, Droplet, Heart } from "lucide-react";

export type ScreeningResultUI = {
  id?: number;
  created_at?: string;
  patient_name: string;
  age: number;
  bmi: number;
  systolic_bp: number;
  diastolic_bp: number;
  diabetes_probability: string;
  diabetes_result: string;
  bp_classification: string;
  bp_recommendation?: string;
};

function getBadge(prob: number) {
  if (prob >= 63) return { bg: "bg-red-50", br: "border-red-200", text: "text-red-700" };
  if (prob >= 48) return { bg: "bg-orange-50", br: "border-orange-200", text: "text-orange-700" };
  return { bg: "bg-emerald-50", br: "border-emerald-200", text: "text-emerald-700" };
}

export default function ScreeningResultModal({
  open,
  onClose,
  result,
  onNewScreening,
}: {
  open: boolean;
  onClose: () => void;
  result: ScreeningResultUI | null;
  onNewScreening?: () => void;
}) {
  if (!open || !result) return null;

  const probNum = parseFloat(String(result.diabetes_probability).replace("%", ""));
  const badge = getBadge(isFinite(probNum) ? probNum : 0);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">Hasil Screening</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* isi */}
        <div className="p-6 space-y-6">
          <div className={`rounded-xl p-5 border-2 ${badge.bg} ${badge.br} ${badge.text}`}>
            <p className="text-center text-xs font-medium uppercase">Probabilitas Diabetes</p>
            <p className="text-center text-4xl font-extrabold">{result.diabetes_probability}</p>
            <p className="text-center mt-2 text-sm">{result.diabetes_result}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
              <p className="font-semibold text-blue-900">Tekanan Darah</p>
              <p>Sistolik: {result.systolic_bp}</p>
              <p>Diastolik: {result.diastolic_bp}</p>
              <p className="font-medium text-blue-700 mt-2">{result.bp_classification}</p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">Data Screening</p>
              <p>Pasien: {result.patient_name}</p>
              <p>Usia: {result.age} tahun</p>
              <p>BMI: {result.bmi}</p>
            </div>
          </div>

          {result.bp_recommendation && (
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
              <p className="font-semibold text-blue-900 mb-1">Rekomendasi:</p>
              <p className="text-sm text-blue-800">{result.bp_recommendation}</p>
            </div>
          )}

          <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4">
            <p className="font-semibold text-yellow-900">Disclaimer:</p>
            <p className="text-sm text-yellow-800">
              Hasil ini hanya prediksi, bukan diagnosis medis profesional.
            </p>
          </div>
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <button onClick={() => window.print()} className="px-4 py-2 border rounded-lg">
            Cetak Hasil
          </button>
          <button
            onClick={onNewScreening ?? onClose}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold"
          >
            Screening Pasien Baru
          </button>
        </div>
      </div>
    </div>
  );
}
