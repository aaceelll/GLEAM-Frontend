
import React, { useState } from 'react';
import { Activity, Users, FileText, TrendingUp, Calendar, Clock } from 'lucide-react';

const NakesDashboard = () => {
  const stats = [
    {
      icon: Users,
      label: "Total Pasien",
      value: "127",
      change: "+12%",
      color: "bg-blue-500"
    },
    {
      icon: Activity,
      label: "Screening Hari Ini",
      value: "8",
      change: "+5%",
      color: "bg-emerald-500"
    },
    {
      icon: FileText,
      label: "Laporan Bulan Ini",
      value: "45",
      change: "+18%",
      color: "bg-purple-500"
    },
    {
      icon: TrendingUp,
      label: "Rata-rata Risiko",
      value: "Medium",
      change: "Stabil",
      color: "bg-orange-500"
    }
  ];

  const recentActivities = [
    { patient: "Budi Santoso", time: "10 menit lalu", status: "Risiko Rendah" },
    { patient: "Siti Aminah", time: "25 menit lalu", status: "Risiko Sedang" },
    { patient: "Ahmad Fauzi", time: "1 jam lalu", status: "Risiko Rendah" },
    { patient: "Rina Wijaya", time: "2 jam lalu", status: "Risiko Tinggi" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Nakes</h1>
        <p className="text-gray-600">Selamat datang di panel tenaga kesehatan GLEAM</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="group bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl p-6 text-left transition-all duration-300 shadow-md hover:shadow-xl">
              <Activity className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-1">Input Cek Kesehatan</h3>
              <p className="text-sm text-emerald-50">Lakukan screening diabetes baru</p>
            </button>
            
            <button className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 text-left transition-all duration-300 shadow-md hover:shadow-xl">
              <FileText className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-1">Lihat Laporan</h3>
              <p className="text-sm text-blue-50">Akses laporan lengkap pasien</p>
            </button>
            
            <button className="group bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-6 text-left transition-all duration-300 shadow-md hover:shadow-xl">
              <Users className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-1">Pertanyaan Private</h3>
              <p className="text-sm text-purple-50">Jawab pertanyaan dari pasien</p>
            </button>
            
            <button className="group bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl p-6 text-left transition-all duration-300 shadow-md hover:shadow-xl">
              <Calendar className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-1">Jadwal Hari Ini</h3>
              <p className="text-sm text-orange-50">Lihat jadwal konsultasi</p>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{activity.patient}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${
                    activity.status === 'Risiko Tinggi' ? 'bg-red-100 text-red-700' :
                    activity.status === 'Risiko Sedang' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NakesDashboard;