"use client";

import { GleamLogo } from "@/components/gleam-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home, FileText, ClipboardList, MessageSquare, HelpCircle, Users,
  Settings, BarChart3, MapPin, Activity, User, History, BookOpen, LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

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
    { icon: HelpCircle, label: "FAQ", href: "/dashboard/admin/faq" },
    { icon: Settings, label: "Pengaturan", href: "/dashboard/admin/settings" },
  ],
  manajemen: [
    { icon: Home, label: "Beranda", href: "/dashboard/manajemen" },
    { icon: BarChart3, label: "Laporan Keseluruhan", href: "/dashboard/manajemen/reports" },
    { icon: MapPin, label: "Lokasi Persebaran", href: "/dashboard/manajemen/locations" },
    { icon: Settings, label: "Pengaturan", href: "/dashboard/manajemen/settings" },
  ],
  nakes: [
    { icon: Home, label: "Beranda", href: "/dashboard/nakes" },
    { icon: Activity, label: "Input Cek Kesehatan", href: "/dashboard/nakes/health-check" },
    { icon: MessageSquare, label: "Pertanyaan Private", href: "/dashboard/nakes/private-questions" }, // ← TAMBAH INI
    { icon: BarChart3, label: "Laporan Keseluruhan", href: "/dashboard/nakes/reports" },
    { icon: Settings, label: "Pengaturan", href: "/dashboard/nakes/settings" },
  ],
  user: [
    { icon: Home, label: "Beranda", href: "/dashboard/user" },
    { icon: Activity, label: "Diabetes Melitus", href: "/dashboard/user/diabetes-melitus" },
    { icon: BookOpen, label: "Penjelasan Umum", href: "/dashboard/user/education" },
    { icon: History, label: "Riwayat", href: "/dashboard/user/history" },
    { icon: FileText, label: "Ulasan Website", href: "/dashboard/user/ulasan-website" },
    { icon: MessageSquare, label: "Forum Komunitas", href: "/dashboard/user/forum" }, // ← SUDAH ADA
    { icon: Settings, label: "Pengaturan", href: "/dashboard/user/settings" },
  ],
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const items = menuItems[role];

  return (
    <div className="flex flex-col h-full bg-white border-r border-emerald-100">
      {/* <div className="p-6 border-b">
        <GleamLogo size="sm" />
      </div> */}

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive && "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
                  !isActive && "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                )}
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>



            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-emerald-100 space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-emerald-900">{user?.nama || "User"}</p>
            <p className="text-xs text-emerald-600 capitalize">{(user?.role as any) || role}</p>
          </div>
        </div>

        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </div>
  );
}