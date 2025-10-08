"use client";

import { useState } from "react";
import {
  Brain, Heart, AlertCircle, CheckCircle, Utensils, Pill,
  ChevronDown, ChevronUp,
} from "lucide-react";

/* =========================
   Utilities: simple pieces
   ========================= */

function Callout({
  tone = "green",
  title,
  children,
}: { tone?: "green" | "yellow" | "red"; title: string; children: React.ReactNode }) {
  const tones = {
    green: "bg-emerald-50 border-emerald-200 text-emerald-800",
    yellow: "bg-amber-50 border-amber-200 text-amber-800",
    red: "bg-red-50 border-red-200 text-red-800",
  } as const;
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <p className="font-semibold mb-1">{title}</p>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

function SectionShell({
  icon,
  title,
  intro,
  bullets,
  callout,
  extra,
}: {
  icon: React.ReactNode;
  title: string;
  intro: string;
  bullets: string[];
  callout?: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>

      <p className="text-gray-700 leading-relaxed">{intro}</p>

      <ul className="space-y-2.5 pl-5">
        {bullets.map((b, i) => (
          <li key={i} className="list-disc text-[15px] text-gray-800 leading-relaxed">
            {b}
          </li>
        ))}
      </ul>

      {callout}
      {extra}
    </div>
  );
}

/* =========================
   Accordion wrapper
   ========================= */
function AccordionCard({
  id, title, Icon, open, onToggle, children,
}: {
  id: string; title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  open: boolean; onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <section
      className={[
        "group rounded-3xl border-2 bg-white transition-all",
        "border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-2xl",
        open && "bg-emerald-50 border-emerald-400 shadow-[0_12px_40px_-12px_rgba(4,120,87,0.25)]",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full text-left px-6 py-5 flex items-center justify-between"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div
            className={[
              "w-10 h-10 rounded-xl text-white flex items-center justify-center transition-all",
              "bg-gradient-to-br from-emerald-600 to-teal-600 shadow-sm",
              "group-hover:shadow-md group-hover:brightness-105",
              open && "ring-2 ring-emerald-300",
            ].join(" ")}
          >
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">{title}</h2>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-emerald-700" />
        ) : (
          <ChevronDown className="w-5 h-5 text-emerald-700" />
        )}
      </button>

      {open && (
        <div className="px-6 pb-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6">{children}</div>
        </div>
      )}
    </section>
  );
}

/* =========================
   PAGE
   ========================= */
export default function EducationPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({ overview: true });
  const toggle = (id: string) => setOpen((s) => ({ ...s, [id]: !s[id] }));
  const openAll = () => setOpen({ overview: true, types: true, symptoms: true, prevention: true, diet: true, treatment: true });
  const closeAll = () => setOpen({});

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header (posisi kiri, tidak terlalu kanan) */}
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black-800">
                Penjelasan Umum Diabetes Melitus
              </h1>
              <p className="text-gray-600 mt-0.5">
                Panduan Lengkap untuk Memahami, Mencegahkan, dan Mengelola Diabetes
              </p>
            </div>
          </div>

          {/* Aksi – kiri & diturunin dari sub-title */}
          <div className="mt-5 md:mt-7 flex items-center gap-3">
            <button
              onClick={openAll}
              className={[
                "inline-flex items-center gap-2 rounded-xl",
                "px-4 py-2.5 md:px-5 md:py-3 text-sm md:text-base",
                "bg-gradient-to-r from-emerald-600 to-teal-600 text-white",
                "hover:from-emerald-700 hover:to-teal-700 hover:shadow-md",
                "active:scale-[0.98] transition",
              ].join(" ")}
            >
              Buka semua
            </button>
            <button
              onClick={closeAll}
              className={[
                "inline-flex items-center gap-2 rounded-xl",
                "px-4 py-2.5 md:px-5 md:py-3 text-sm md:text-base",
                "border-2 border-emerald-600 text-emerald-700",
                "hover:bg-emerald-50 active:scale-[0.98] transition",
              ].join(" ")}
            >
              Tutup semua
            </button>
          </div>
        </header>

        {/* 6 materi (card tabs/accordion) — diturunkan dari sub-title */}
        <div className="mt-8 md:mt-10 space-y-4">
          <AccordionCard id="overview" title="Apa Itu Diabetes" Icon={Brain} open={!!open.overview} onToggle={toggle}>
            <SectionShell
              icon={<Brain className="w-5 h-5" />}
              title="Apa Itu Diabetes Melitus?"
              intro="Kondisi kronis saat kadar gula darah tinggi karena kekurangan insulin atau tubuh tidak efektif menggunakan insulin."
              bullets={[
                "Insulin diproduksi pankreas untuk membantu glukosa masuk ke sel.",
                "Jika insulin kurang/tidak efektif → glukosa menumpuk di darah → komplikasi.",
                "Deteksi dini + perawatan rutin mencegah komplikasi jangka panjang.",
              ]}
              callout={
                <Callout tone="yellow" title="Catatan singkat">
                  Gejala awal bisa ringan atau tidak terasa—screening berkala penting walau merasa sehat.
                </Callout>
              }
            />
          </AccordionCard>

          <AccordionCard id="types" title="Jenis Diabetes" Icon={Heart} open={!!open.types} onToggle={toggle}>
            <SectionShell
              icon={<Heart className="w-5 h-5" />}
              title="Jenis-jenis Utama"
              intro="Ada beberapa tipe dengan mekanisme berbeda namun ujungnya sama: gula darah tinggi."
              bullets={[
                "Tipe 1: autoimun—pankreas hampir tidak memproduksi insulin; perlu insulin seumur hidup.",
                "Tipe 2: resistensi insulin—paling sering, terkait pola hidup; fokus pada diet, aktivitas, obat, kadang insulin.",
                "Gestasional: terjadi saat hamil; biasanya membaik setelah persalinan namun meningkatkan risiko Tipe 2.",
              ]}
            />
          </AccordionCard>

          <AccordionCard id="symptoms" title="Gejala" Icon={AlertCircle} open={!!open.symptoms} onToggle={toggle}>
            <SectionShell
              icon={<AlertCircle className="w-5 h-5" />}
              title="Gejala yang Perlu Diwaspadai"
              intro="Sebagian orang tanpa gejala; karena itu pemeriksaan berkala penting."
              bullets={[
                "Sering haus & sering BAK, mudah lelah.",
                "Penurunan berat badan tanpa sebab, penglihatan kabur.",
                "Luka sulit sembuh, infeksi berulang, kesemutan tangan/kaki.",
              ]}
              callout={
                <Callout tone="red" title="Segera ke IGD bila">
                  Gula darah &lt; 70 mg/dL atau &gt; 300 mg/dL, pingsan/kebingungan, sesak/nyeri dada, muntah terus-menerus.
                </Callout>
              }
            />
          </AccordionCard>

          <AccordionCard id="prevention" title="Pencegahan" Icon={CheckCircle} open={!!open.prevention} onToggle={toggle}>
            <SectionShell
              icon={<CheckCircle className="w-5 h-5" />}
              title="Langkah Pencegahan Tipe 2"
              intro="Perubahan kecil namun konsisten berdampak besar."
              bullets={[
                "Berat badan ideal (turunkan 5–10% bila overweight).",
                "Aktif bergerak ≥150 menit/minggu; jalan 30 menit/hari.",
                "Pola makan seimbang: lebih banyak sayur/buah, pilih karbo kompleks, batasi gula & lemak jenuh.",
                "Stop merokok, batasi alkohol, tidur cukup & kelola stres.",
              ]}
              callout={
                <Callout tone="green" title="Tip singkat">
                  Buat jurnal makan & aktivitas 2 minggu pertama untuk membangun kebiasaan.
                </Callout>
              }
            />
          </AccordionCard>

          <AccordionCard id="diet" title="Pola Makan" Icon={Utensils} open={!!open.diet} onToggle={toggle}>
            <SectionShell
              icon={<Utensils className="w-5 h-5" />}
              title="Panduan Pola Makan"
              intro="Fokus pada kualitas makanan dan kontrol porsi."
              bullets={[
                "Utamakan sayuran hijau, buah rendah gula, protein rendah lemak, dan biji-bijian utuh.",
                "Batasi makanan manis, karbo olahan (nasi/roti putih), gorengan, daging olahan, dan makanan tinggi garam.",
                "Gunakan piring lebih kecil, baca label nutrisi, minum air putih 8 gelas/hari.",
              ]}
            />
          </AccordionCard>

          <AccordionCard id="treatment" title="Pengobatan" Icon={Pill} open={!!open.treatment} onToggle={toggle}>
            <SectionShell
              icon={<Pill className="w-5 h-5" />}
              title="Pengelolaan & Pengobatan"
              intro="Kombinasi gaya hidup dan terapi medis sesuai kebutuhan."
              bullets={[
                "Gaya hidup: diet seimbang, aktivitas rutin, tidur & manajemen stres.",
                "Obat oral (mis. metformin, dsb.)—sesuai anjuran dokter.",
                "Insulin: wajib untuk Tipe 1; mungkin diperlukan pada Tipe 2.",
                "Monitoring rutin: gula darah harian, HbA1c tiap 3 bulan, cek mata/kaki, fungsi ginjal.",
              ]}
              callout={
                <Callout tone="red" title="Peringatan">
                  Jangan mengubah dosis/obat tanpa konsultasi—terapi selalu dipersonalisasi.
                </Callout>
              }
            />
          </AccordionCard>
        </div>
      </div>
    </div>
  );
}
