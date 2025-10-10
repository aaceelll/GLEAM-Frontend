"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Activity, Loader2, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import dynamic from "next/dynamic";
import { UserDetailModal } from "@/components/modals/user-detail-modal";
import { RWUsersModal } from "@/components/modals/rw-users-modal";

// Dynamic import untuk peta (client-side only)
const InteractiveMap = dynamic(
  () => import("@/components/modals/maps/interactive-map").then((mod) => mod.InteractiveMap),
  { ssr: false, loading: () => <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse" /> }
);

interface UserLocation {
  id: string;
  nama: string;
  email: string;
  nomor_telepon: string;
  kelurahan: string;
  rw: string;
  alamat: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface RWData {
  rw: string;
  count: number;
}

interface Statistics {
  total_keseluruhan: number;
  total_pedalangan: number;
  total_padangsari: number;
  pedalangan_rw: RWData[];
  padangsari_rw: RWData[];
}

export default function LokasiPersebaran() {
  const [users, setUsers] = useState<UserLocation[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showRWModal, setShowRWModal] = useState(false);
  const [selectedRW, setSelectedRW] = useState<{ kelurahan: string; rw: string }>({
    kelurahan: "",
    rw: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get("/locations/users"),
        api.get("/locations/statistics"),
      ]);

      if (usersRes.data.success) {
        const normalizedUsers = (usersRes.data.data || []).map((user: any) => ({
          ...user,
          address: user.address || user.alamat || "",
        }));
        setUsers(normalizedUsers);
      }

      if (statsRes.data.success) {
        setStatistics(statsRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: any) => {
    const normalizedUser: UserLocation = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      nomor_telepon: user.nomor_telepon,
      kelurahan: user.kelurahan,
      rw: user.rw,
      alamat: user.alamat,
      address: user.address || user.alamat || "",
      latitude: user.latitude || 0,
      longitude: user.longitude || 0,
    };
    
    setSelectedUser(normalizedUser);
    setShowUserDetail(true);
  };

  const handleRWCardClick = (kelurahan: string, rw: string) => {
    setSelectedRW({ kelurahan, rw });
    setShowRWModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-16 w-16 text-emerald-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Memuat data lokasi persebaran...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <MapPin className="h-8 w-8 text-white animate-pulse" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Lokasi Persebaran
              </h1>
              <p className="text-base md:text-lg text-gray-600 font-medium">
                Distribusi kasus Diabetes Melitus di Banyumanik
              </p>
            </div>
          </div>
        </header>

        {/* Stats Overview Cards - SEMUA HIJAU */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatsCard
            title="Pedalangan"
            count={statistics?.total_pedalangan || 0}
            gradient="from-emerald-500 to-teal-600"
            icon="📍"
          />
          <StatsCard
            title="Padangsari"
            count={statistics?.total_padangsari || 0}
            gradient="from-teal-500 to-cyan-600"
            icon="🗺️"
          />
          <StatsCard
            title="Total Keseluruhan"
            count={statistics?.total_keseluruhan || 0}
            gradient="from-emerald-600 to-green-700"
            icon="📊"
          />
        </div>

        {/* Map Card */}
        <Card className="group relative overflow-hidden border-0 shadow-2xl rounded-3xl backdrop-blur-xl bg-white/80 hover:shadow-emerald-200/50 transition-all duration-700 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <CardHeader className="relative flex items-center justify-between gap-4 border-b border-emerald-100 bg-gradient-to-r from-white/80 to-emerald-50/50 py-5 px-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-black bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  Peta Persebaran Wilayah
                </CardTitle>
                <p className="text-sm md:text-base text-gray-600 font-medium mt-1">
                  Visualisasi geografis distribusi kasus
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full h-[500px] rounded-2xl overflow-hidden border-2 border-emerald-100">
              <InteractiveMap users={users} onUserClick={handleUserClick} />
            </div>
          </CardContent>
        </Card>

        {/* Data Grid - KEDUA SECTION HIJAU */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pedalangan */}
          <RWSection
            kelurahan="Pedalangan"
            rwData={statistics?.pedalangan_rw || []}
            onRWClick={handleRWCardClick}
            gradient="from-emerald-500 to-teal-600"
          />

          {/* Padangsari */}
          <RWSection
            kelurahan="Padangsari"
            rwData={statistics?.padangsari_rw || []}
            onRWClick={handleRWCardClick}
            gradient="from-teal-500 to-cyan-600"
          />
        </div>
      </div>

      {/* Modals */}
      <UserDetailModal
        isOpen={showUserDetail}
        onClose={() => setShowUserDetail(false)}
        user={selectedUser}
      />

      <RWUsersModal
        isOpen={showRWModal}
        onClose={() => setShowRWModal(false)}
        kelurahan={selectedRW.kelurahan}
        rw={selectedRW.rw}
        onUserClick={handleUserClick}
      />
    </div>
  );
}

// Stats Card Component dengan Icon
interface StatsCardProps {
  title: string;
  count: number;
  gradient: string;
  icon: string;
}

function StatsCard({ title, count, gradient, icon }: StatsCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer`}>
      <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-0 transition-transform duration-700"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <Activity className="h-8 w-8 text-white/90" />
          <span className="text-3xl">{icon}</span>
        </div>
        <p className="text-white/80 text-sm font-semibold mb-1">{title}</p>
        <p className="text-4xl font-black text-white">{count}</p>
        <p className="text-white/70 text-xs mt-1">kasus terdaftar</p>
      </div>
    </div>
  );
}

// RW Section Component
interface RWSectionProps {
  kelurahan: string;
  rwData: RWData[];
  onRWClick: (kelurahan: string, rw: string) => void;
  gradient: string;
}

function RWSection({ kelurahan, rwData, onRWClick, gradient }: RWSectionProps) {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-2xl rounded-3xl backdrop-blur-xl bg-white/90 hover:shadow-emerald-300/50 transition-all duration-700 hover:scale-[1.01]">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <CardHeader className="relative flex items-center gap-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 py-5 px-6">
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
          <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500`}>
            <MapPin className="h-5 w-5 text-white" />
          </div>
        </div>
        <div>
          <CardTitle className={`text-xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {kelurahan}
          </CardTitle>
          <p className="text-sm text-gray-600 font-medium mt-1">Distribusi kasus per RW</p>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4 relative">
        <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {rwData.map((rw, idx) => (
            <RWCard
              key={rw.rw}
              rw={rw.rw}
              count={rw.count}
              kelurahan={kelurahan}
              onClick={() => onRWClick(kelurahan, rw.rw)}
              delay={idx * 50}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// RW Card Component - HIJAU SEMUA
interface RWCardProps {
  rw: string;
  count: number;
  kelurahan: string;
  onClick: () => void;
  delay: number;
}

function RWCard({ rw, count, kelurahan, onClick, delay }: RWCardProps) {
  const hasUsers = count > 0;

  return (
    <div
      onClick={onClick}
      className={`group/item relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-white to-emerald-50/30 border-2 border-emerald-200/50 hover:border-emerald-400 hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 transform -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000"></div>
      <div className="relative flex items-center justify-between mb-3">
        <h3 className="font-black text-emerald-900 text-lg">{rw}</h3>
        {hasUsers ? (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              count > 10 
                ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white" 
                : count > 5 
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                : "bg-gradient-to-r from-emerald-400 to-teal-500 text-white"
            }`}>
              {count} orang
            </span>
          </div>
        ) : (
          <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-200 text-gray-600">
            0 orang
          </span>
        )}
      </div>
      <div className="relative">
        <p className="text-sm text-gray-600 font-medium">Diabetes Melitus</p>
        <div className="mt-2 w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              hasUsers 
                ? "bg-gradient-to-r from-emerald-400 to-teal-500" 
                : "bg-gray-300"
            }`}
            style={{ width: hasUsers ? "100%" : "0%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}