"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Activity, Loader2, TrendingUp, Search, X } from "lucide-react";
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

interface RWData { rw: string; count: number; }

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
  const [selectedRW, setSelectedRW] = useState<{ kelurahan: string; rw: string }>({ kelurahan: "", rw: "" });
  const [search, setSearch] = useState(""); 


  useEffect(() => { fetchData(); }, []);

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

      if (statsRes.data.success) setStatistics(statsRes.data.data);
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

  // NEW: hasil pencarian dipetakan per kelurahan
const searchLower = search.trim().toLowerCase();
const resultsByKelurahan = {
  Pedalangan: users.filter(
    (u) =>
      u.kelurahan?.toLowerCase() === "pedalangan" &&
      (u.nama?.toLowerCase().includes(searchLower) || u.email?.toLowerCase().includes(searchLower))
  ),
  Padangsari: users.filter(
    (u) =>
      u.kelurahan?.toLowerCase() === "padangsari" &&
      (u.nama?.toLowerCase().includes(searchLower) || u.email?.toLowerCase().includes(searchLower))
  ),
};

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 md:px-10 py-8">
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
    <div className="min-h-screen bg-white px-6 md:px-10 py-9">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* ICON CHIP – versi responsif */}
            <div className="relative isolate shrink-0">
              <span
                aria-hidden
                className="absolute -inset-1.5 sm:-inset-2 rounded-2xl bg-gradient-to-br from-emerald-400/25 to-teal-500/25 blur-lg -z-10"
              />
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

             {/* Judul + subjudul */}
            <div>
              <h1 className="text-[22px] leading-[1.15] sm:text-3xl md:text-4xl font-bold text-gray-800">
                Lokasi Persebaran<br className="hidden sm:block" />
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-0.5">
                Distribusi kasus Diabetes Melitus di Banyumanik
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatsCard title="Pedalangan" count={statistics?.total_pedalangan || 0} gradient="from-emerald-500 to-teal-600" icon="" />
          <StatsCard title="Padangsari" count={statistics?.total_padangsari || 0} gradient="from-teal-500 to-cyan-600" icon="" />
          <StatsCard title="Total Keseluruhan" count={statistics?.total_keseluruhan || 0} gradient="from-emerald-600 to-green-700" icon="" />
        </div>

        {/* Map Card */}
        <Card className="group relative overflow-visible border-0 shadow-2xl rounded-3xl backdrop-blur-xl bg-white/80 hover:shadow-emerald-200/50 transition-all duration-700 hover:scale-[1.01]">
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
                <p className="text-sm md:text-base text-gray-600 font-medium mt-1">Visualisasi geografis distribusi kasus</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full h-[500px] rounded-2xl border-2 border-emerald-100 overflow-visible">
              {/* inner wrapper yang ngerounded tile/overlay aja */}
              <div className="h-full w-full rounded-2xl overflow-hidden">
                <InteractiveMap users={users} onUserClick={handleUserClick} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search global untuk nama pengguna */}
        <div className="w-full">
          <div className="relative max-w-4xl mx-0">
            {/* wrapper dengan ring, border, hover, dan focus yang konsisten */}
            <div
              className="
                group relative rounded-2xl ring-1 ring-emerald-200/70 border-2 border-emerald-200/40 bg-white
                shadow-sm hover:shadow-md transition-all
                focus-within:ring-emerald-500 focus-within:border-emerald-500
              "
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500/80" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama pengguna"
                className="
                  w-full h-14 rounded-2xl bg-transparent
                  pl-12 pr-12 outline-none
                  placeholder:text-gray-400 text-gray-800
                "
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="
                    absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center
                    rounded-xl hover:bg-emerald-50 active:scale-95 transition
                    text-emerald-600
                  "
                  aria-label="Bersihkan pencarian"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {search && (
              <p className="text-sm text-gray-500 mt-2">
                Menampilkan hasil untuk: <span className="font-semibold text-gray-700">“{search}”</span>
              </p>
            )}
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RWSection
            kelurahan="Pedalangan"
            rwData={statistics?.pedalangan_rw || []}
            onRWClick={handleRWCardClick}
            gradient="from-emerald-500 to-teal-600"
            searchQuery={search}                                   // NEW
            searchResults={resultsByKelurahan.Pedalangan}          // NEW
            onUserClick={handleUserClick}                          // NEW
          />
          <RWSection
            kelurahan="Padangsari"
            rwData={statistics?.padangsari_rw || []}
            onRWClick={handleRWCardClick}
            gradient="from-teal-500 to-cyan-600"
            searchQuery={search}                                   // NEW
            searchResults={resultsByKelurahan.Padangsari}          // NEW
            onUserClick={handleUserClick}                          // NEW
          />
        </div>
      </div>

      {/* Modals */}
      <UserDetailModal isOpen={showUserDetail} onClose={() => setShowUserDetail(false)} user={selectedUser} />
      <RWUsersModal isOpen={showRWModal} onClose={() => setShowRWModal(false)} kelurahan={selectedRW.kelurahan} rw={selectedRW.rw} onUserClick={handleUserClick} />
    </div>
  );
}

/* ====== Small cards (dipulihkan hover scale) ====== */
interface StatsCardProps { title: string; count: number; gradient: string; icon: string; }

function StatsCard({ title, count, gradient, icon }: StatsCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6
                  shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer`}
    >
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

/* ====== RW Section ====== */
interface RWSectionProps {
  kelurahan: string;
  rwData: RWData[];
  onRWClick: (kelurahan: string, rw: string) => void;
  gradient: string;
  // NEW:
  searchQuery?: string;
  searchResults?: UserLocation[];
  onUserClick?: (u: UserLocation) => void;
}

function RWSection({
  kelurahan,
  rwData,
  onRWClick,
  gradient,
  searchQuery = "",
  searchResults = [],
  onUserClick,
}: RWSectionProps) {
  const isSearching = !!searchQuery.trim();

  return (
    <Card className="group relative overflow-hidden border-0 shadow-2xl rounded-3xl backdrop-blur-xl bg-white/90 hover:shadow-emerald-300/50 transition-all duration-700 hover:scale-[1.01]">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <CardHeader className="relative flex items-center gap-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 py-5 px-6">
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
          <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <MapPin className="h-5 w-5 text-white" />
          </div>
        </div>
        <div>
          <CardTitle className={`text-xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{kelurahan}</CardTitle>
          <p className="text-sm text-gray-600 font-medium mt-1">
            {isSearching ? "Hasil pencarian" : "Distribusi kasus per RW"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4 relative">
        {isSearching ? (
          searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((u) => (
                <SearchUserCard key={u.id} user={u} onClick={() => onUserClick?.(u)} />
              ))}
            </div>
          ) : (
            <div
              className="
                p-5 rounded-3xl bg-emerald-50
                border-2 border-emerald-200 text-emerald-900
                shadow-sm
              "
            >
              Data tidak ditemukan.
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 gap-3 max-h-[60vh] sm:max-h-[600px] overflow-y-auto pr-0 sm:pr-2 py-1 custom-scrollbar">
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
        )}
      </CardContent>
    </Card>
  );
}

function SearchUserCard({ user, onClick }: { user: UserLocation; onClick: () => void }) {
  const addr = (user.address || user.alamat || "") as string;
  return (
    <button
      onClick={onClick}
      className="
        w-full text-left
        transition-all
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
      "
    >
      <div
        className="
          flex items-start gap-4 p-5 rounded-3xl
          bg-white border-2 border-emerald-300
          shadow-sm hover:shadow-lg hover:-translate-y-0.5
          hover:border-emerald-500
          transition-all
        "
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white grid place-items-center shrink-0 shadow">
          {/* ikon user */}
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white grid place-items-center shrink-0 shadow">
            <User className="w-6 h-6" />
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-emerald-700 text-[15px] leading-tight truncate">
            {user.nama || "-"}
          </p>
          <p className="text-gray-700 text-sm truncate">{user.email || "-"}</p>
          {addr && (
            <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">
              {addr}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

/* ====== RW Card (tanpa scale agar tidak kepotong) ====== */
interface RWCardProps {
  rw: string;
  count: number;
  kelurahan: string;
  onClick: () => void;
  delay: number;
}

function RWCard({ rw, count, onClick, delay }: RWCardProps) {
  const hasUsers = count > 0;

  return (
    <div
      onClick={onClick}
      className={`
        group/item relative p-5 rounded-2xl
        bg-gradient-to-br from-white to-emerald-50/30
        border border-emerald-200/60
        transition-all duration-300 cursor-pointer animate-fade-in
        hover:border-emerald-400 hover:shadow-lg
        hover:ring-1 hover:ring-emerald-300/60
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 -translate-x-full group-hover/item:translate-x-0 transition-transform duration-700"></div>

      <div className="relative flex items-center justify-between mb-3">
        <h3 className="font-black text-emerald-900 text-lg">{rw}</h3>
        {hasUsers ? (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                count > 10
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white"
                  : count > 5
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                  : "bg-gradient-to-r from-emerald-400 to-teal-500 text-white"
              }`}
            >
              {count} orang
            </span>
          </div>
        ) : (
          <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-200 text-gray-600">0 orang</span>
        )}
      </div>

      <div className="relative">
        <p className="text-sm text-gray-600 font-medium">Diabetes Melitus</p>
        <div className="mt-2 w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              hasUsers ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gray-300"
            }`}
            style={{ width: hasUsers ? "100%" : "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
