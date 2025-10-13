"use client";

import React from "react";
import { X, Activity, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

export interface ScreeningResultUI {
  patient_name: string;
  age: number;
  bmi: number;
  systolic_bp: number;
  diastolic_bp: number;
  diabetes_probability: string;
  diabetes_result: string;
  bp_classification: string;
  bp_recommendation: string;
  created_at: string;
}

type ModalProps = {
  open: boolean;
  onClose: () => void;
  result: ScreeningResultUI | null;
  onNewScreening: () => void;
};

function getRiskLevel(probabilityStr: string) {
  const numStr = probabilityStr.replace("%", "").trim();
  const prob = parseFloat(numStr);

  if (isNaN(prob)) {
    return {
      label: "Risiko Tidak Diketahui",
      color: { bg: "bg-gray-50", border: "border-gray-300", text: "text-gray-900", icon: "text-gray-600" },
      icon: <AlertCircle className="w-6 h-6" />,
    };
  }

  if (prob >= 48) {
    return {
      label: "Risiko Tinggi",
      color: { bg: "bg-red-50", border: "border-red-300", text: "text-red-900", icon: "text-red-600" },
      icon: <AlertCircle className="w-6 h-6" />,
    };
  }

  if (prob <= 40) {
    return {
      label: "Risiko Rendah",
      color: { bg: "bg-green-50", border: "border-green-300", text: "text-green-900", icon: "text-green-600" },
      icon: <CheckCircle className="w-6 h-6" />,
    };
  }

  return {
    label: "Risiko Sedang",
    color: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-900", icon: "text-orange-600" },
    icon: <AlertTriangle className="w-6 h-6" />,
  };
}

function getBPColor(classification: string) {
  const lower = classification.toLowerCase();
  if (lower.includes("optimal")) return { bg: "bg-green-50", border: "border-green-300", text: "text-green-900" };
  if (lower.includes("normal") && !lower.includes("tinggi")) return { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-900" };
  if (lower.includes("pra hipertensi") || lower.includes("normal tinggi")) return { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-900" };
  if (lower.includes("derajat 1")) return { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-900" };
  if (lower.includes("derajat 2")) return { bg: "bg-red-50", border: "border-red-300", text: "text-red-900" };
  if (lower.includes("derajat 3") || lower.includes("sistolik terisolasi")) return { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-900" };
  return { bg: "bg-gray-50", border: "border-gray-300", text: "text-gray-900" };
}

export default function ScreeningResultModal({ open, onClose, result, onNewScreening }: ModalProps) {
  if (!open || !result) return null;

  const risk = getRiskLevel(result.diabetes_probability);
  const bpColors = getBPColor(result.bp_classification);

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(result.created_at));

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-2 border-gray-100">
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b-2 border-gray-100 px-6 py-4 rounded-t-3xl z-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Hasil Screening Diabetes</h2>
                <p className="text-xs text-gray-500 mt-0.5">{formattedDate}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className={`rounded-2xl border-2 p-6 ${risk.color.bg} ${risk.color.border}`}>
              <div className="flex items-start gap-4">
                <div className={risk.color.icon}>{risk.icon}</div>
                <div>
                  <h3 className={`text-2xl font-bold ${risk.color.text}`}>{risk.label}</h3>
                  <p className={`text-3xl font-extrabold ${risk.color.text}`}>{result.diabetes_probability}</p>
                  <p className={`text-sm ${risk.color.text} opacity-80`}>{result.diabetes_result}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-gray-100 bg-white">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 font-semibold text-gray-900">
                Data Pasien
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <DataItem label="Nama" value={result.patient_name} />
                <DataItem label="Usia" value={`${result.age} tahun`} />
                <DataItem label="BMI" value={result.bmi} />
              </div>
            </div>

            <div className="rounded-2xl border-2 border-gray-100 bg-white">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 font-semibold text-gray-900">
                Tekanan Darah
              </div>
              <div className="p-5">
                <div className="flex justify-between mb-3">
                  <span className="text-sm text-gray-600">Sistolik / Diastolik</span>
                  <span className="text-lg font-bold text-gray-900">
                    {result.systolic_bp} / {result.diastolic_bp} mmHg
                  </span>
                </div>
                <div className={`rounded-xl border-2 p-4 ${bpColors.bg} ${bpColors.border}`}>
                  <p className={`font-semibold mb-1 ${bpColors.text}`}>{result.bp_classification}</p>
                  <p className={`text-sm ${bpColors.text} opacity-80`}>{result.bp_recommendation}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-5">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5" /> Rekomendasi
              </h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Konsultasikan dengan dokter untuk pemeriksaan lanjutan.</li>
                <li>• Jaga pola makan dan rutin olahraga.</li>
                <li>• Pantau tekanan dan gula darah secara berkala.</li>
              </ul>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t-2 border-gray-100 px-6 py-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Tutup
            </button>
            <button
              onClick={onNewScreening}
              className="flex-1 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
            >
              Screening Pasien Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-xs text-gray-500 font-semibold mb-1">{label}</p>
      <p className="font-bold text-gray-900">{value}</p>
    </div>
  );
}
