"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ScreeningResultModal, { ScreeningResultUI } from "@/components/nakes/screening-result-modal";

export default function PageImpl() {
  const [open, setOpen] = useState(false);
  const [resultData, setResultData] = useState<ScreeningResultUI | null>(null);

  // hasil akan dikirim dari halaman screening
  async function fetchLatestResult() {
    try {
      const res = await fetch("/api/screenings/latest"); // endpoint ambil hasil terakhir
      if (!res.ok) throw new Error("Gagal ambil hasil screening.");
      const data = await res.json();
      setResultData(data);
      setOpen(true);
    } catch (err) {
      console.error(err);
      alert("Tidak dapat memuat hasil screening.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Hasil Screening Pasien
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Klik tombol di bawah untuk membuka hasil screening terbaru.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={fetchLatestResult}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md transition-all text-sm sm:text-base"
          >
            Lihat Hasil Screening Terbaru
          </Button>
        </div>
      </div>

      {/* Modal hasil screening */}
      <ScreeningResultModal
        open={open}
        onClose={() => setOpen(false)}
        result={resultData ?? null}
        onNewScreening={() => {
          setOpen(false);
          window.location.href = "/dashboard/nakes/health-check";
        }}
      />
    </div>
  );
}
