"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";

type Role = "admin" | "super_admin" | "manajemen" | "nakes" | "user";

function mapRoleToSegment(role?: string): Exclude<Role, "super_admin"> {
  if (!role) return "user";
  if (role === "super_admin" || role === "admin") return "admin";
  if (role === "manajemen") return "manajemen";
  if (role === "nakes") return "nakes";
  return "user";
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const cookieRole = getCookie("role") as Role | null;
    let r: Role | null = cookieRole ?? null;

    const cookieName = getCookie("user_nama");
    let displayName = cookieName || "";

    const raw = localStorage.getItem("user_data");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (!displayName) {
          displayName = parsed?.nama || parsed?.name || "";
        }
        if (!r && parsed?.role) r = parsed.role as Role;
      } catch {
        // ignore
      }
    }

    setUserName(displayName || "User");

    if (!r) {
      router.replace("/login");
      return;
    }

    setRole(r);

    const seg = pathname.split("/")[2];
    const mySeg = mapRoleToSegment(r);
    const myHome = `/dashboard/${mySeg}`;

    if (pathname === "/dashboard") {
      router.replace(myHome);
      return;
    }

    if (seg && seg !== mySeg) {
      router.replace(myHome);
      return;
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "user_data" && e.newValue) {
        try {
          const p = JSON.parse(e.newValue);
          const newName = p?.nama || p?.name || "";
          setUserName(newName || "User");
          if (p?.role && p.role !== r) {
            const nextSeg = mapRoleToSegment(p.role);
            setRole(p.role as Role);
            router.replace(`/dashboard/${nextSeg}`);
          }
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [pathname, router]);

  if (!role) return null;

  const sidebarRole = role === "super_admin" ? "admin" : (role as any);

  return (
    <div className="relative min-h-screen bg-gray-50 lg:flex">
      <aside className="w-72 flex-shrink-0 shadow-2xl">
        <Sidebar role={sidebarRole} displayName={userName || undefined} />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="p-6 md:p-8">{children}</div>  
        </main>
      </div>
    </div>
  );
}