"use client";

import React from "react";
import { X } from "lucide-react";

export type ScreeningResultUI = {
  id?: number;
  created_at?: string;
  patient_name: string;
  age: number;
  bmi: number;
  systolic_bp: number;
  diastolic_bp: number;
  diabetes_probability: string; // contoh "48.47%"
  diabetes_result: string;      // contoh "Risiko Sedang"
  bp_classification: string;
  bp_recommendation?: string;
};

function riskClasses(prob: number) {
  if (prob >= 63)
    return { box: "bg-red-50 border-red-200 text-red-700" };
  if (prob >= 48)
    return { box: "bg-orange-50 border-orange-200 text-orange-700" };
  return { box: "bg-emerald-50 border-emerald-200 text-emerald-700" };
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
  const cls = riskClasses(isFinite(probNum) ? probNum : 0);

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal */}
      <div className="relative w-full max-w-2xl mx-4 rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-xl font-bold text-gray-900">Hasil Screening</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Banner Probabilitas */}
          <div className={`rounded-xl border-2 px-5 py-4 text-center ${cls.box}`}>
            <p className="text-xs font-semibold tracking-wide uppercase">
              Probabilitas Diabetes
            </p>
            <p className="mt-1 text-4xl font-extrabold">
              {result.diabetes_probability}
            </p>
            <p className="mt-2 text-sm">{result.diabetes_result}</p>
          </div>

          {/* Grid Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tekanan darah */}
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
              <p className="font-semibold text-blue-900 mb-1">Tekanan Darah</p>
              <p className="text-blue-800 text-sm">Sistolik: {result.systolic_bp}</p>
              <p className="text-blue-800 text-sm">Diastolik: {result.diastolic_bp}</p>
              <p className="mt-2 font-semibold text-blue-700">
                {result.bp_classification}
              </p>
            </div>

            {/* Data Screening */}
            <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
              <p className="font-semibold text-gray-900 mb-1">Data Screening</p>
              <p className="text-sm text-gray-800">Pasien: {result.patient_name}</p>
              <p className="text-sm text-gray-800">Usia: {result.age} tahun</p>
              <p className="text-sm text-gray-800">BMI: {result.bmi}</p>
            </div>
          </div>

          {/* Rekomendasi (opsional) */}
          {result.bp_recommendation && (
            <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4">
              <p className="font-semibold text-yellow-900 mb-1">Rekomendasi:</p>
              <p className="text-sm text-yellow-800">{result.bp_recommendation}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-white"
          >
            Cetak Hasil
          </button>

          <button
            type="button"
            onClick={onNewScreening ?? onClose}
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow"
          >
            Screening Pasien Baru
          </button>
        </div>
      </div>
    </div>
  );
}
