"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Apple, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Brain,
  Pill,
  Utensils
} from "lucide-react";

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-bold mb-3">Penjelasan Umum Diabetes Melitus</h1>
          <p className="text-emerald-50 text-lg">
            Panduan lengkap untuk memahami, mencegah, dan mengelola diabetes
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Apa Itu Diabetes", icon: Brain },
            { id: "types", label: "Jenis Diabetes", icon: Heart },
            { id: "symptoms", label: "Gejala", icon: AlertCircle },
            { id: "prevention", label: "Pencegahan", icon: CheckCircle },
            { id: "diet", label: "Pola Makan", icon: Utensils },
            { id: "treatment", label: "Pengobatan", icon: Pill }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={`flex items-center gap-2 rounded-full px-6 py-3 transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-lg scale-105"
                    : "hover:bg-emerald-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && <OverviewSection />}
            {activeTab === "types" && <TypesSection />}
            {activeTab === "symptoms" && <SymptomsSection />}
            {activeTab === "prevention" && <PreventionSection />}
            {activeTab === "diet" && <DietSection />}
            {activeTab === "treatment" && <TreatmentSection />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickFactsCard />
            <EmergencyCard />
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Components
function OverviewSection() {
  return (
    <Card className="p-8 bg-white shadow-lg rounded-2xl border-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 rounded-xl">
          <Brain className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Apa Itu Diabetes Melitus?</h2>
      </div>
      
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p className="text-lg">
          <strong className="text-emerald-600">Diabetes Melitus</strong> adalah penyakit metabolik kronis yang ditandai dengan 
          <span className="font-semibold"> kadar glukosa (gula) darah yang tinggi</span> akibat gangguan produksi atau fungsi insulin.
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-xl border-l-4 border-emerald-500">
          <h3 className="font-bold text-xl mb-3 text-gray-800">Mengapa Diabetes Terjadi?</h3>
          <p>
            Insulin adalah hormon yang diproduksi oleh pankreas untuk membantu glukosa masuk ke dalam sel tubuh 
            sebagai sumber energi. Ketika insulin tidak cukup atau tidak bekerja dengan baik, glukosa menumpuk 
            dalam darah dan menyebabkan berbagai komplikasi kesehatan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 p-5 rounded-xl border border-red-200">
            <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Fakta Penting
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• 537 juta orang dewasa hidup dengan diabetes (2021)</li>
              <li>• Diabetes adalah penyebab kematian ke-7 di dunia</li>
              <li>• 1 dari 2 orang dengan diabetes belum terdiagnosis</li>
            </ul>
          </div>

          <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200">
            <h4 className="font-bold text-emerald-700 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Kabar Baik
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• Diabetes tipe 2 dapat dicegah</li>
              <li>• Dapat dikendalikan dengan gaya hidup sehat</li>
              <li>• Deteksi dini mencegah komplikasi serius</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}

function TypesSection() {
  const types = [
    {
      title: "Diabetes Tipe 1",
      color: "from-red-500 to-pink-500",
      icon: AlertCircle,
      description: "Pankreas tidak menghasilkan insulin sama sekali",
      causes: ["Gangguan autoimun", "Faktor genetik", "Biasanya muncul di usia muda"],
      treatment: "Membutuhkan insulin seumur hidup"
    },
    {
      title: "Diabetes Tipe 2",
      color: "from-orange-500 to-yellow-500",
      icon: Activity,
      description: "Tubuh tidak menggunakan insulin dengan efektif",
      causes: ["Gaya hidup tidak sehat", "Obesitas", "Faktor keturunan"],
      treatment: "Diet, olahraga, obat oral, dan/atau insulin"
    },
    {
      title: "Diabetes Gestasional",
      color: "from-purple-500 to-pink-500",
      icon: Heart,
      description: "Terjadi selama kehamilan",
      causes: ["Perubahan hormon", "Resistensi insulin sementara"],
      treatment: "Biasanya hilang setelah melahirkan"
    }
  ];

  return (
    <div className="space-y-6">
      {types.map((type, idx) => {
        const Icon = type.icon;
        return (
          <Card key={idx} className="p-6 bg-white shadow-lg rounded-2xl border-none overflow-hidden">
            <div className={`bg-gradient-to-r ${type.color} text-white p-6 -m-6 mb-6 rounded-t-2xl`}>
              <div className="flex items-center gap-3">
                <Icon className="w-8 h-8" />
                <h3 className="text-2xl font-bold">{type.title}</h3>
              </div>
              <p className="mt-2 text-white/90">{type.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Penyebab:</h4>
                <ul className="space-y-1">
                  {type.causes.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-1">Penanganan:</h4>
                <p className="text-gray-700">{type.treatment}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function SymptomsSection() {
  const symptoms = [
    { icon: "💧", text: "Sering merasa haus", level: "Umum" },
    { icon: "🚽", text: "Sering buang air kecil", level: "Umum" },
    { icon: "😴", text: "Mudah lelah dan lemas", level: "Umum" },
    { icon: "👁️", text: "Penglihatan kabur", level: "Serius" },
    { icon: "⚖️", text: "Penurunan berat badan tanpa sebab", level: "Serius" },
    { icon: "🩹", text: "Luka yang sulit sembuh", level: "Serius" },
    { icon: "🦠", text: "Infeksi berulang", level: "Serius" },
    { icon: "🦶", text: "Kesemutan di tangan/kaki", level: "Komplikasi" }
  ];

  return (
    <Card className="p-8 bg-white shadow-lg rounded-2xl border-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 rounded-xl">
          <AlertCircle className="w-6 h-6 text-orange-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Gejala Diabetes</h2>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg mb-6">
        <p className="text-gray-700">
          <strong>⚠️ Perhatian:</strong> Diabetes tipe 2 sering tidak menunjukkan gejala pada tahap awal. 
          Pemeriksaan rutin sangat penting untuk deteksi dini!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {symptoms.map((symptom, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
              symptom.level === "Umum"
                ? "bg-blue-50 border-blue-200"
                : symptom.level === "Serius"
                ? "bg-orange-50 border-orange-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{symptom.icon}</span>
              <div>
                <p className="font-semibold text-gray-800">{symptom.text}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    symptom.level === "Umum"
                      ? "bg-blue-200 text-blue-700"
                      : symptom.level === "Serius"
                      ? "bg-orange-200 text-orange-700"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  {symptom.level}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PreventionSection() {
  return (
    <Card className="p-8 bg-white shadow-lg rounded-2xl border-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-xl">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Cara Mencegah Diabetes</h2>
      </div>

      <div className="space-y-6">
        {[
          {
            title: "Jaga Berat Badan Ideal",
            icon: "⚖️",
            tips: ["Turunkan 5-10% berat badan jika obesitas", "BMI ideal: 18.5-24.9", "Ukur lingkar pinggang secara rutin"]
          },
          {
            title: "Aktif Bergerak",
            icon: "🏃",
            tips: ["Minimal 150 menit aktivitas sedang/minggu", "30 menit jalan kaki setiap hari", "Kurangi duduk terlalu lama"]
          },
          {
            title: "Pola Makan Sehat",
            icon: "🥗",
            tips: ["Perbanyak sayur dan buah", "Pilih karbohidrat kompleks", "Batasi gula dan lemak jenuh"]
          },
          {
            title: "Hindari Rokok & Alkohol",
            icon: "🚭",
            tips: ["Merokok meningkatkan risiko 30-40%", "Batasi konsumsi alkohol", "Cari dukungan untuk berhenti"]
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              {item.title}
            </h3>
            <ul className="space-y-2">
              {item.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DietSection() {
  return (
    <Card className="p-8 bg-white shadow-lg rounded-2xl border-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 rounded-xl">
          <Utensils className="w-6 h-6 text-orange-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Panduan Pola Makan</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Yang Dianjurkan */}
        <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
          <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            ✅ Dianjurkan
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-2xl">🥦</span>
              <div>
                <strong>Sayuran hijau:</strong> Bayam, brokoli, kangkung
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-2xl">🍎</span>
              <div>
                <strong>Buah rendah gula:</strong> Apel, pir, berry
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-2xl">🌾</span>
              <div>
                <strong>Biji-bijian utuh:</strong> Oatmeal, beras merah
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-2xl">🐟</span>
              <div>
                <strong>Protein rendah lemak:</strong> Ikan, ayam tanpa kulit
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-2xl">🥜</span>
              <div>
                <strong>Kacang-kacangan:</strong> Almond, walnut, kedelai
              </div>
            </li>
          </ul>
        </div>

        {/* Yang Dihindari */}
        <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
          <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            ❌ Hindari/Batasi
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-2xl">🍰</span>
              <div>
                <strong>Makanan manis:</strong> Kue, permen, minuman bersoda
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-2xl">🍞</span>
              <div>
                <strong>Karbohidrat olahan:</strong> Roti putih, nasi putih
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-2xl">🍟</span>
              <div>
                <strong>Gorengan:</strong> Makanan yang digoreng
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-2xl">🥓</span>
              <div>
                <strong>Daging olahan:</strong> Sosis, ham, bacon
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-2xl">🧂</span>
              <div>
                <strong>Makanan tinggi garam:</strong> Makanan kalengan
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h4 className="font-bold text-gray-800 mb-3">💡 Tips Praktis:</h4>
        <ul className="space-y-2 text-gray-700">
          <li>• Gunakan piring lebih kecil untuk kontrol porsi</li>
          <li>• Makan teratur 3x sehari dengan 2 snack sehat</li>
          <li>• Baca label nutrisi sebelum membeli</li>
          <li>• Minum air putih minimal 8 gelas/hari</li>
        </ul>
      </div>
    </Card>
  );
}

function TreatmentSection() {
  return (
    <Card className="p-8 bg-white shadow-lg rounded-2xl border-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-xl">
          <Pill className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Pengelolaan & Pengobatan</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
          <h3 className="text-xl font-bold text-purple-800 mb-3">1. Perubahan Gaya Hidup</h3>
          <p className="text-gray-700 mb-3">Langkah pertama dan terpenting dalam mengelola diabetes:</p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              Diet seimbang dengan kontrol karbohidrat
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              Olahraga teratur minimal 150 menit/minggu
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              Manajemen stress dan tidur cukup
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-3">2. Obat-obatan</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Obat Oral (untuk Tipe 2):</h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Metformin (mengurangi produksi glukosa hati)</li>
                <li>• Sulfonilurea (meningkatkan produksi insulin)</li>
                <li>• DPP-4 inhibitor (membantu kerja insulin)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Terapi Insulin:</h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Wajib untuk diabetes tipe 1</li>
                <li>• Mungkin diperlukan untuk diabetes tipe 2</li>
                <li>• Berbagai jenis: cepat, sedang, lambat, campuran</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-3">3. Monitoring Rutin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Pemeriksaan Mandiri:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Cek gula darah harian</li>
                <li>• Catat pola makan</li>
                <li>• Monitor berat badan</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Pemeriksaan Medis:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• HbA1c setiap 3 bulan</li>
                <li>• Cek mata & kaki rutin</li>
                <li>• Fungsi ginjal tahunan</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
          <p className="text-gray-700">
            <strong className="text-red-700">⚠️ Penting:</strong> Jangan pernah menghentikan atau mengubah dosis obat 
            tanpa berkonsultasi dengan dokter. Setiap pasien membutuhkan penanganan yang disesuaikan.
          </p>
        </div>
      </div>
    </Card>
  );
}

// Sidebar Components
function QuickFactsCard() {
  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl rounded-2xl border-none">
      <h3 className="text-xl font-bold mb-4">📊 Fakta Cepat</h3>
      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2">
          <span className="text-yellow-300 text-xl">•</span>
          <div>Target gula darah puasa: <strong>70-130 mg/dL</strong></div>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-yellow-300 text-xl">•</span>
          <div>Target HbA1c: <strong>&lt; 7%</strong></div>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-yellow-300 text-xl">•</span>
          <div>Olahraga ideal: <strong>30 menit/hari</strong></div>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-yellow-300 text-xl">•</span>
          <div>Cek gula darah: <strong>2-4x/hari</strong> (tergantung kondisi)</div>
        </li>
      </ul>
    </Card>
  );
}

function EmergencyCard() {
  return (
    <Card className="p-6 bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-xl rounded-2xl border-none">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <AlertCircle className="w-6 h-6" />
        🚨 Gawat Darurat
      </h3>
      <p className="text-sm mb-4 text-red-50">Segera ke IGD jika mengalami:</p>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <span className="text-yellow-300 text-xl">⚠️</span>
          <div>Gula darah &lt;70 atau &gt;300 mg/dL</div>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-yellow-300 text-xl">⚠️</span>
          <div>Pingsan atau kebingungan</div>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-yellow-300 text-xl">⚠️</span>
          <div>Sesak napas atau nyeri dada</div>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-yellow-300 text-xl">⚠️</span>
          <div>Muntah terus menerus</div>
        </li>
      </ul>
      <div className="mt-4 pt-4 border-t border-red-400">
        <p className="text-sm">
          <strong>Hotline Diabetes:</strong>
          <br />
          📞 119 (Ambulans)
          <br />
          📞 1500-567 (BPJS)
        </p>
      </div>
    </Card>
  );
}