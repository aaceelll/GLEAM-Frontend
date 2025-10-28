"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home, FileText, ClipboardList, MessageSquare, Users, Settings,
  BarChart3, MapPin, Activity, User as UserIcon, History, BookOpen, LogOut,
  ChevronDown, ChevronUp, Menu, X 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

interface SidebarProps {
  role: "admin" | "manajemen" | "nakes" | "user";
  displayName?: string; 
}

const menuItems = {
  admin: [
    { icon: Home, label: "Beranda", href: "/dashboard/admin" },
    { icon: BookOpen, label: "Konten Materi", href: "/dashboard/admin/materi" },
    { icon: ClipboardList, label: "Assessment Manager", href: "/dashboard/admin/assessment" },
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
    { icon: History, label: "Riwayat Quiz", href: "/dashboard/user/riwayat" },
    { icon: FileText, label: "Ulasan Website", href: "/dashboard/user/ulasan-website" },
    { icon: MessageSquare, label: "Forum Komunitas", href: "/dashboard/user/forum" },
    { icon: Settings, label: "Pengaturan", href: "/dashboard/user/settings" },
  ],
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export function Sidebar({ role, displayName: displayNameProp }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const items = menuItems[role];

  const [uiUser, setUiUser] = useState<{ nama?: string; role?: string } | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const pick = () => {
      const cookieName = getCookie("user_nama");
      const cookieRole = getCookie("role");

      if (cookieName && cookieRole) {
        setUiUser({ nama: cookieName, role: cookieRole });
        return;
      }

      if (user) {
        setUiUser({ nama: user.nama, role: (user as any).role });
        return;
      }

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

  const displayName = displayNameProp ?? uiUser?.nama ?? "User";
  const displayRole = (uiUser?.role as any) || role;

  return (
  <>
    <button
      onClick={() => setMobileOpen(true)}
      className="lg:hidden fixed top-4 left-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-white/90 shadow-md"
      aria-label="Buka menu"
    >
      <Menu className="h-5 w-5 text-emerald-700" />
    </button>

    <div
      onClick={() => setMobileOpen(false)}
      className={cn(
        "lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity",
        mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    />

    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "bg-white border-r-2 border-gray-100 shadow-2xl flex flex-col"
      )}
    >
      <div className="px-6 py-6 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">G</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">GLEAM</h1>
              <p className="text-xs text-emerald-700 font-medium">Health Monitor</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "w-full justify-start relative transition-all duration-300 rounded-xl h-12",
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

      <div className="px-6">
        <div className="my-3 border-t border-gray-200" />
      </div>

      <div className="px-6 pb-6">
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
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {accountOpen && (
          <div className="mt-2 space-y-1 animate-fade-in">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-11"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Keluar</span>
            </Button>
          </div>
        )}
      </div>
    </aside>
  </>
  );
}