"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home, FileText, ClipboardList, MessageSquare, Users, Settings,
  BarChart3, MapPin, Activity, User as UserIcon, History, BookOpen, LogOut,
  ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

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
  const [accountOpen, setAccountOpen] = useState(false);

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
    const onStorage = (e: StorageEvent) => { if (e.key === "user_data") pick(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  const displayName = uiUser?.nama || "User";
  const displayRole = (uiUser?.role as any) || role;

  return (
    <aside className="h-full bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
      {/* Brand (besar + divider) */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <img
            src="/images/gleam-logo.png"
            alt="GLEAM"
            className="w-14 h-14 md:w-14 md:h-20 rounded-xl object-contain"
          />
          <div>
            <h1 className="text-4xl md:text-3xl font-bold tracking-tight text-gray-900 leading-none">
              GLEAM
            </h1>
            <p className="text-[13px] md:text-xs text-gray-500 leading-tight">
              Glucose, Learning, Education,<br /> and Monitoring
            </p>
          </div>
        </div>
        <div className="mt-5 border-t border-gray-200" />
      </div>

      {/* Navigation (UI & hover tetap) */}
      <nav className="px-4 py-3">
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
                  <div className={cn("relative", isActive && "animate-pulse")}>
                    <Icon className="h-5 w-5 relative z-10" />
                    {isActive && <div className="absolute inset-0 bg-white/30 blur-md rounded-full" />}
                  </div>
                  <span className="font-medium">{item.label}</span>
                  {isActive && <div className="absolute right-0 w-1 h-8 bg-white rounded-l-full" />}
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Divider sebelum akun */}
      <div className="px-6">
        <div className="my-3 border-t border-gray-200" />
      </div>

      {/* Account dropdown */}
      <div className="px-6 pb-6">
        {/* Header kartu akun */}
        <button
          onClick={() => setAccountOpen((v) => !v)}
          className={cn(
            "w-full flex items-center justify-between gap-3 px-4 py-3",
            "rounded-2xl border-2 border-gray-100 bg-white shadow-sm",
            "hover:border-emerald-500 transition-colors"
          )}
          aria-expanded={accountOpen}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500 capitalize">{String(displayRole)}</p>
            </div>
          </div>
          {accountOpen ? (
            <ChevronUp className="h-5 w-5 text-emerald-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-emerald-600" />
          )}
        </button>

        {/* Panel dropdown */}
        {accountOpen && (
          <div
            className={[
              "mt-2 rounded-2xl bg-white p-4",
              "border-2 border-gray-200",
              "shadow-[0_12px_30px_-12px_rgba(0,0,0,0.15)]",
              "transition-all hover:border-red-500 hover:ring-2 hover:ring-red-200",
              "hover:shadow-[0_18px_40px_-12px_rgba(244,63,94,0.20)]"
            ].join(" ")}
          >
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 font-semibold text-red-600"
            >
              <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-red-100/70">
                <LogOut className="h-5 w-5" />
              </span>
              <span>Keluar</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
