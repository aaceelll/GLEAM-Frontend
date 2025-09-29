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

      if (pathname === "/dashboard") {
        if (r === "admin" || r === "super_admin") router.replace("/dashboard/admin");
        else router.replace(`/dashboard/${r}`);
        return;
      }

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

  return (
    // ⬇️ hanya container ini yang full screen, scroll global dimatikan
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar (tetap) */}
      <aside className="w-64 flex-shrink-0 border-r bg-card sticky top-0 h-screen overflow-y-auto">
        <Sidebar role={sidebarRole} />
      </aside>

      {/* Kanan */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header (tetap) */}
        <header className="h-16 border-b bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-20">
          <GleamLogo size="sm" />
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
        </header>

        {/* Area konten yang scroll */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
