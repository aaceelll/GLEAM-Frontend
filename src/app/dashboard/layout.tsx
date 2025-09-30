"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { GleamLogo } from "@/components/gleam-logo";
import { Sidebar } from "@/components/dashboard/sidebar";

type Role = "admin" | "super_admin" | "manajemen" | "nakes" | "user";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<Role | null>(null);

  // ===== Auth + routing guard
  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (!userData) {
      router.replace("/login/user");
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      const r: Role = (parsed.role ?? "user") as Role;
      setRole(r);

      // /dashboard (root) → redirect sesuai role
      if (pathname === "/dashboard") {
        if (r === "admin" || r === "super_admin") router.replace("/dashboard/admin");
        else router.replace(`/dashboard/${r}`);
        return;
      }

      // admin/super_admin jangan masuk route user
      if ((r === "admin" || r === "super_admin") && !pathname.startsWith("/dashboard/admin")) {
        if (pathname.startsWith("/dashboard/user") || pathname === "/dashboard") {
          router.replace("/dashboard/admin");
        }
      }
    } catch {
      setRole("user");
    }
  }, [router, pathname]);

  if (!role) return null;

  const sidebarRole = role === "super_admin" ? "admin" : (role as any);

  // tinggi header (4rem = h-16)
  const HEADER_PX = 64;

  return (
    <div className="min-h-screen bg-background">
      {/* ===== Header global full width (tetap di atas) ===== */}
      <header className="fixed top-0 inset-x-0 h-16 border-b bg-card/90 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GleamLogo size="sm" />
            {/* bisa tambahkan subtitle kalau mau */}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground capitalize">{role}</span>
            <button
              onClick={() => {
                localStorage.removeItem("gleam_token");
                localStorage.removeItem("user_data");
                window.location.href = "/login/user";
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* ===== Body: Sidebar + Content (mulai di bawah header) ===== */}
      <div className="flex" style={{ paddingTop: HEADER_PX }}>
        {/* Sidebar (tingginya = tinggi layar - header) */}
        <aside
          className="w-64 flex-shrink-0 border-r bg-card"
          style={{ height: `calc(100vh - ${HEADER_PX}px)` }}
        >
          {/* Sidebar sudah pakai h-full internal, jadi cukup overflow di sini */}
          <div className="h-full overflow-y-auto">
            <Sidebar role={sidebarRole} />
          </div>
        </aside>

        {/* Konten kanan (scroll sendiri) */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ height: `calc(100vh - ${HEADER_PX}px)` }}
        >
          <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
