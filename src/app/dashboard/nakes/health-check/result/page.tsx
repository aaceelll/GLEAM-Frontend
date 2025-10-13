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

interface Props {
  open: boolean;
  onClose: () => void;
  result: ScreeningResultUI | null;
  onNewScreening: () => void;
}

/** LOGIC ML: sesuai Python backend */
function getRiskLevel(probabilityStr: string): {
  level: "low" | "medium" | "high";
  label: string;
  color: {
    bg: string;
    border: string;
    text: string;
    icon: string;
  };
  icon: React.ReactNode;
} {
  // Parse angka dari string "47.64%" atau "47.64"
  const numStr = probabilityStr.replace("%", "").trim();
  const prob = parseFloat(numStr);

  if (isNaN(prob)) {
    return {
      level: "medium",
      label: "Risiko Tidak Diketahui",
      color: {
        bg: "bg-gray-50",
        border: "border-gray-300",
        text: "text-gray-900",
        icon: "text-gray-600",
      },
      icon: <AlertCircle className="w-6 h-6" />,
    };
  }

  // Logic ML dari Python:
  // >= 48 -> Tinggi
  // <= 40 -> Rendah  
  // else -> Sedang
  if (prob >= 48) {
    return {
      level: "high",
      label: "Risiko Tinggi",
      color: {
        bg: "bg-red-50",
        border: "border-red-300",
        text: "text-red-900",
        icon: "text-red-600",
      },
      icon: <AlertCircle className="w-6 h-6" />,
    };
  }

  if (prob <= 40) {
    return {
      level: "low",
      label: "Risiko Rendah",
      color: {
        bg: "bg-green-50",
        border: "border-green-300",
        text: "text-green-900",
        icon: "text-green-600",
      },
      icon: <CheckCircle className="w-6 h-6" />,
    };
  }

  // 40 < prob < 48
  return {
    level: "medium",
    label: "Risiko Sedang",
    color: {
      bg: "bg-orange-50",
      border: "border-orange-300",
      text: "text-orange-900",
      icon: "text-orange-600",
    },
    icon: <AlertTriangle className="w-6 h-6" />,
  };
}

/** Warna card BP classification */
function getBPColor(classification: string): {
  bg: string;
  border: string;
  text: string;
} {
  const lower = classification.toLowerCase();

  if (lower.includes("optimal")) {
    return { bg: "bg-green-50", border: "border-green-300", text: "text-green-900" };
  }
  if (lower.includes("normal") && !lower.includes("tinggi")) {
    return { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-900" };
  }
  if (lower.includes("pra hipertensi") || lower.includes("normal tinggi")) {
    return { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-900" };
  }
  if (lower.includes("derajat 1")) {
    return { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-900" };
  }
  if (lower.includes("derajat 2")) {
    return { bg: "bg-red-50", border: "border-red-300", text: "text-red-900" };
  }
  if (lower.includes("derajat 3") || lower.includes("sistolik terisolasi")) {
    return { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-900" };
  }

  return { bg: "bg-gray-50", border: "border-gray-300", text: "text-gray-900" };
}

export default function ScreeningResultModal({
  open,
  onClose,
  result,
  onNewScreening,
}: Props) {
  if (!open || !result) return null;

  const risk = getRiskLevel(result.diabetes_probability);
  const bpColors = getBPColor(result.bp_classification);

  // Format tanggal
  const date = new Date(result.created_at);
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-2 border-gray-100">
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-gray-100 px-6 py-4 rounded-t-3xl z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Hasil Screening Diabetes
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">{formattedDate}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Risk Status Card - PALING ATAS */}
            <div
              className={`rounded-2xl border-2 p-6 ${risk.color.bg} ${risk.color.border}`}
            >
              <div className="flex items-start gap-4">
                <div className={risk.color.icon}>{risk.icon}</div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className={`text-2xl font-bold ${risk.color.text}`}>
                      {risk.label}
                    </h3>
                    <span className={`text-3xl font-extrabold ${risk.color.text}`}>
                      {result.diabetes_probability}
                    </span>
                  </div>
                  <p className={`text-sm ${risk.color.text} opacity-80`}>
                    {result.diabetes_result}
                  </p>
                </div>
              </div>
            </div>

            {/* Data Pasien */}
            <div className="rounded-2xl border-2 border-gray-100 bg-white overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Data Pasien</h3>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <DataItem label="Nama" value={result.patient_name} />
                <DataItem label="Usia" value={`${result.age} tahun`} />
                <DataItem label="BMI" value={result.bmi} />
              </div>
            </div>

            {/* Tekanan Darah */}
            <div className="rounded-2xl border-2 border-gray-100 bg-white overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Tekanan Darah</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Sistolik / Diastolik
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {result.systolic_bp} / {result.diastolic_bp} <span className="text-sm font-normal text-gray-600">mmHg</span>
                  </span>
                </div>

                <div
                  className={`rounded-xl border-2 p-4 ${bpColors.bg} ${bpColors.border}`}
                >
                  <p className={`font-semibold mb-1 ${bpColors.text}`}>
                    {result.bp_classification}
                  </p>
                  {result.bp_recommendation && (
                    <p className={`text-sm ${bpColors.text} opacity-80`}>
                      {result.bp_recommendation}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Rekomendasi */}
            <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-5">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Rekomendasi
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Konsultasikan hasil ini dengan dokter untuk pemeriksaan lebih lanjut</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Jaga pola makan sehat dan olahraga teratur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Monitor gula darah dan tekanan darah secara berkala</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t-2 border-gray-100 px-6 py-4 rounded-b-3xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Tutup
              </button>
              <button
                onClick={onNewScreening}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
              >
                Screening Pasien Baru
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
        {label}
      </p>
      <p className="font-bold text-gray-900">{value}</p>
    </div>
  );
}