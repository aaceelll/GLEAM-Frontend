// src/components/ScreeningLineChart.tsx
"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import clsx from "clsx";

/** ==== Types (sinkron dengan halaman) ==== */
type ScreeningResult = {
  id: number | string;
  patient_name: string;
  age: number | string;
  gender: string;
  systolic_bp: number | string;
  diastolic_bp: number | string;
  heart_disease: string;
  smoking_history: string;
  bmi: number | string;
  blood_glucose_level: number | string;
  diabetes_probability: string | number;
  diabetes_result: string;
  bp_classification: string;
  bp_recommendation: string;
  created_at: string;
};

type Props = {
  data: ScreeningResult[];
  className?: string;
  /** Tinggi chart utama (px) */
  height?: number;
};

/** ==== Utils ==== */
function parsePercent(p: string | number): number {
  if (typeof p === "number") return p;
  if (!p) return NaN;
  const cleaned = String(p).replace("%", "").replace(",", ".").trim();
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
}
function fmtDate(d: string | number | Date) {
  const dt = new Date(d);
  // Contoh: 12 Okt 2025 14:22
  return dt.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function fmtShortDate(d: string | number | Date) {
  const dt = new Date(d);
  // Contoh: 12 Okt
  return dt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
}
function riskColor(prob: number) {
  // Konsisten dengan threshold di page
  if (prob >= 48) return "#dc2626"; // red-600
  if (prob <= 40) return "#059669"; // yellow-600
  return "#ca8a04"; // emerald-600
}

/** ==== Tooltip kustom ==== */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  const prob = item?.prob as number | undefined;

  return (
    <div className="rounded-xl border border-emerald-100 bg-white/95 shadow-lg backdrop-blur p-3 min-w-[220px]">
      <div className="text-xs text-gray-500 mb-1">Waktu</div>
      <div className="font-semibold text-gray-900">{fmtDate(item?.created_at)}</div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-gray-500">Skor Risiko</div>
          <div className="flex items-baseline gap-1">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: riskColor(prob ?? 0) }}
            />
            <div className="text-base font-bold text-gray-900">
              {Number.isFinite(prob) ? `${prob?.toFixed(2)}%` : "-"}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Tekanan Darah</div>
          <div className="text-base font-semibold text-gray-900">
            {item?.systolic_bp}/{item?.diastolic_bp}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Gula Darah</div>
          <div className="text-base font-semibold text-gray-900">
            {item?.blood_glucose_level ? `${item.blood_glucose_level} mg/dL` : "—"}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500">BMI</div>
          <div className="text-base font-semibold text-gray-900">{item?.bmi ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}

/** ==== Komponen utama ==== */
export default function ScreeningLineChart({
  data,
  className,
  height = 320,
}: Props) {
  const parsed = useMemo(() => {
    const arr = Array.isArray(data) ? data.slice() : [];
    // sort ASC by date supaya garis dari lama → terbaru
    arr.sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
    return arr
      .map((d) => {
        const prob = parsePercent(d.diabetes_probability);
        const glc = Number(d.blood_glucose_level);
        const bmi = Number(d.bmi);
        return {
          ...d,
          // field untuk chart
          created_at: d.created_at,
          dateLabel: fmtShortDate(d.created_at),
          prob: Number.isFinite(prob) ? prob : NaN,
          glucose: Number.isFinite(glc) ? glc : undefined,
          bmiVal: Number.isFinite(bmi) ? bmi : undefined,
        };
      })
      .filter((x) => Number.isFinite(x.prob));
  }, [data]);

  if (!parsed.length) {
    return (
      <div
        className={clsx(
          "rounded-3xl border-2 border-gray-100 bg-white p-6 shadow-xl",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              {/* minimalist sparkline icon substitute */}
              <svg width="18" height="18" viewBox="0 0 24 24" className="text-emerald-600">
                <path
                  fill="currentColor"
                  d="M3 17h3l3-7l3 10l3-6l3 3h3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fillOpacity="0"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Grafik Riwayat Screening
              </h3>
              <p className="text-sm text-gray-600 -mt-0.5">
                Belum ada data yang dapat digambar.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
          Lakukan screening terlebih dahulu untuk melihat tren risiko.
        </div>
      </div>
    );
  }

  // warna & gradient hijau GLEAM
  const strokeMain = "#059669"; // emerald-600
  const strokeDim = "rgba(5, 150, 105, 0.5)";
  const fillGradFrom = "rgba(16, 185, 129, 0.18)"; // emerald-500 @ ~18%
  const fillGradTo = "rgba(16, 185, 129, 0.02)";

  // batas kategori untuk bantu pembacaan
  const midLine = 48;
  const highLine = 63;

  return (
    <div
      className={clsx(
        "rounded-3xl border-2 border-gray-100 bg-white shadow-xl",
        "p-5 sm:p-6",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-emerald-600">
              <path
                fill="currentColor"
                d="M3 17h3l3-7l3 10l3-6l3 3h3"
                stroke="currentColor"
                strokeWidth="1.5"
                fillOpacity="0"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Grafik Riwayat Screening
            </h3>
            <p className="text-sm text-gray-600 -mt-0.5">
              Tren skor risiko diabetes dari waktu ke waktu
            </p>
          </div>
        </div>

        {/* Legend sederhana */}
        <div className="hidden md:flex items-center gap-3">
          <span className="inline-flex items-center gap-2 text-xs text-gray-600">
            <span className="w-3 h-1.5 rounded-full" style={{ background: strokeMain }} />
            Risiko (%)
          </span>
          <span className="inline-flex items-center gap-2 text-xs text-gray-600">
            <span className="w-3 h-1.5 rounded-full bg-yellow-500" />
            Batas Rendah (40%)
          </span>
          <span className="inline-flex items-center gap-2 text-xs text-gray-600">
            <span className="w-3 h-1.5 rounded-full bg-red-500" />
            Batas Tinggi (48%)
          </span>
        </div>
      </div>

      {/* Chart utama */}
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer>
          <LineChart
            data={parsed}
            margin={{ top: 16, right: 20, bottom: 8, left: 0 }}
          >
            {/* Defs untuk gradient area & stroke */}
            <defs>
              <linearGradient id="gleamArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillGradFrom} />
                <stop offset="100%" stopColor={fillGradTo} />
              </linearGradient>
              <linearGradient id="gleamStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={strokeMain} />
                <stop offset="100%" stopColor={strokeDim} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

            <XAxis
              dataKey="created_at"
              tickFormatter={fmtShortDate}
              tickMargin={8}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              minTickGap={28}
              height={34}
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis
              domain={[0, (max: number) => Math.max(100, Math.ceil(max / 10) * 10)]}
              tickFormatter={(v) => `${v}%`}
              width={46}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              stroke="#6B7280"
              fontSize={12}
            />

            {/* Garis ambang */}
            <ReferenceLine
              y={midLine}
              stroke="#EAB308" // yellow-500
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
            />
            <ReferenceLine
              y={highLine}
              stroke="#EF4444" // red-500
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
            />

            {/* Area halus dibawah line untuk nuansa */}
            <Area
              type="monotone"
              dataKey="prob"
              stroke="none"
              fill="rgba(16, 185, 129, 0.15)"
              isAnimationActive={true}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="prob"
              stroke="url(#gleamStroke)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
              isAnimationActive={true}
            />

            {/* Brush mini preview (area kecil di bawah untuk scroll/zoom) */}
            {parsed.length > 8 && (
              <Brush
                dataKey="created_at"
                stroke="#059669"
                travellerWidth={8}
                height={28}
                tickFormatter={fmtShortDate}
              >
                <AreaChart data={parsed}>
                  {/* <defs>
                    <linearGradient id="gleamMini" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(16,185,129,0.35)" />
                      <stop offset="100%" stopColor="rgba(16,185,129,0.06)" />
                    </linearGradient>
                  </defs> */}
                  <Area
                    dataKey="prob"
                    stroke="#34D399"
                    fill="url(#gleamMini)"
                    type="monotone"
                  />
                </AreaChart>
              </Brush>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer kecil: ringkasan terakhir */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      </div>
    </div>
  );
}
