"use client";

import { Card } from "@/components/ui/card";
import { Activity, Calendar, Bell } from "lucide-react";

export default function UserDashboard() {
  const hoverCard = 
    "group relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-white " +
    "transition-all duration-500 hover:border-emerald-400 " +
    "hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1 cursor-pointer";

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Selamat Datang di GLEAM</h1>
            <p className="text-gray-600 mt-1">Partner kesehatan diabetes Anda</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={hoverCard}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Glukosa Terakhir</h3>
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <div className="text-5xl font-bold text-gray-900">120</div>
                <div className="text-xl text-gray-500">mg/dL</div>
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">Normal</span>
              </div>
            </div>
          </Card>

          <Card className={hoverCard}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Cek Terakhir</h3>
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <div className="text-5xl font-bold text-gray-900">2</div>
                <div className="text-xl text-gray-500">jam yang lalu</div>
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Hari ini</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Tips Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Tips Hari Ini</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "💧", title: "Jaga Hidrasi", desc: "Minum minimal 8 gelas air putih sehari" },
              { icon: "🥗", title: "Sarapan Sehat", desc: "Pilih menu tinggi serat dan protein" },
              { icon: "🚶", title: "Jalan Kaki", desc: "30 menit setelah makan membantu kontrol gula darah" }
            ].map((tip, idx) => (
              <Card key={idx} className={hoverCard}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative p-6 flex flex-col gap-3">
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {tip.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}