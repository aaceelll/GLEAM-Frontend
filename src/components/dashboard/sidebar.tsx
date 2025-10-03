"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home, FileText, ClipboardList, MessageSquare, HelpCircle, Users,
  Settings, BarChart3, MapPin, Activity, User as UserIcon, History, BookOpen, LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useMemo, useState } from "react";

interface SidebarProps {
  role: "admin" | "manajemen" | "nakes" | "user";
}

const menuItems = {
  admin: [
    { icon: Home, label: "Beranda", href: "/dashboard/admin" },
    { icon: BookOpen, label: "Konten Materi", href: "/dashboard/admin/materi" },
    { icon: ClipboardList, label: "Assessment", href: "/dashboard/admin/assessment" },
    { icon: Users, label: "Akun & Peran", href: "/dashboard/admin/users" },
    { icon: MessageSquare, label: "Forum Komunitas", href: "/dashboard/admin/forum" },
    { icon: Settings, label: "Pengaturan", href: "/dashboard/admin/settings" },
  ],
  manajemen: [
    { icon: Home, label: "Beranda", href: "/dashboard/manajemen" },
    { icon: BarChart3, label: "Laporan Keseluruhan", href: "/dashboard/manajemen/laporan" },
    { icon: MapPin, label: "Lokasi Persebaran", href: "/dashboard/manajemen/lokasi" },
    { icon: Settings, label: "Pengaturan", href: "/dashboard/manajemen/pengaturan" },
  ],
  nakes: [
    { icon: Home, label: "Beranda", href: "/dashboard/nakes" },
    { icon: Activity, label: "Input Cek Kesehatan", href: "/dashboard/nakes/health-check" },
    { icon: MessageSquare, label: "Pertanyaan Private", href: "/dashboard/nakes/private-questions" },
    { icon: BarChart3, label: "Laporan Keseluruhan", href: "/dashboard/nakes/reports" },
    { icon: Settings, label: "Pengaturan", href: "/dashboard/nakes/settings" },
  ],
  user: [
    { icon: Home, label: "Beranda", href: "/dashboard/user" },
    { icon: Activity, label: "Diabetes Melitus", href: "/dashboard/user/diabetes-melitus" },
    { icon: BookOpen, label: "Penjelasan Umum", href: "/dashboard/user/education" },
    { icon: History, label: "Riwayat", href: "/dashboard/user/history" },
    { icon: FileText, label: "Ulasan Website", href: "/dashboard/user/ulasan-website" },
    { icon: MessageSquare, label: "Forum Komunitas", href: "/dashboard/user/forum" },
    { icon: Settings, label: "Pengaturan", href: "/dashboard/user/settings" },
  ],
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const items = menuItems[role];

  const [uiUser, setUiUser] = useState<{ nama?: string; role?: string } | null>(null);

  // sinkronkan dari context atau localStorage (fallback) + dengarkan perubahan storage
  useEffect(() => {
    const pick = () => {
      if (user) return setUiUser({ nama: user.nama, role: (user as any).role });
      try {
        const raw = localStorage.getItem("user_data");
        if (raw) {
          const u = JSON.parse(raw);
          setUiUser({ nama: u?.nama, role: u?.role });
        }
      } catch {}
    };
    pick();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "user_data") pick();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  const displayName = uiUser?.nama || "User";
  const displayRole = (uiUser?.role as any) || role;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
      {/* Logo / Brand Section with Full Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-lg">
        <div className="flex items-center gap-3">
          {/* Logo Image */}
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl ring-2 ring-white/40 p-1.5">
              <img 
                src="/images/gleam-logo.png" 
                alt="GLEAM Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute inset-0 w-12 h-12 rounded-2xl bg-white/10 animate-ping"></div>
          </div>
          
          {/* Brand Text */}
          <div className="flex-1">
            <h2 className="font-bold text-xl text-white drop-shadow-md">GLEAM</h2>
            <p className="text-[10px] leading-tight text-emerald-50 font-medium">Glucose, Learning, Education,<br/>and Monitoring</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-12 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-600" 
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:translate-x-1"
                )}
              >
                <Link href={item.href} className="flex items-center gap-3 w-full">
                  {/* Icon with glow effect on active */}
                  <div className={cn(
                    "relative",
                    isActive && "animate-pulse"
                  )}>
                    <Icon className="h-5 w-5 relative z-10" />
                    {isActive && (
                      <div className="absolute inset-0 bg-white/30 blur-md rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Active indicator line */}
                  {isActive && (
                    <div className="absolute right-0 w-1 h-8 bg-white rounded-l-full"></div>
                  )}
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-emerald-100/50 space-y-3 bg-gradient-to-br from-emerald-50/50 to-teal-50/30">
        {/* User Card */}
        <div className="relative p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white drop-shadow-sm">
                {displayName}
              </p>
              <p className="text-xs text-emerald-50 capitalize font-medium">
                {displayRole}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start gap-3 h-12 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-200 group hover:shadow-lg"
        >
          <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
          <span className="font-medium">Keluar</span>
        </Button>
      </div>
    </div>
  );
}