"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
// import { Bell, Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

type Role = "admin" | "super_admin" | "manajemen" | "nakes" | "user";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState<string>("");

  // ===== Auth + routing guard
  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (!userData) {
      router.replace("/login");
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      const r: Role = (parsed.role ?? "user") as Role;
      setRole(r);
      setUserName(parsed.nama || "User");

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

  return (
    <div className="relative min-h-screen bg-gray-50 lg:flex">
      {/* ===== Sidebar (Fixed Left) ===== */}
      <aside className="w-72 flex-shrink-0 shadow-2xl">
        <Sidebar role={sidebarRole} />
      </aside>

      {/* Spacer hanya untuk desktop agar konten tidak ketimpa */}
      <div className="hidden lg:block w-72 flex-shrink-0" />

      {/* ===== Main Content Area ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
