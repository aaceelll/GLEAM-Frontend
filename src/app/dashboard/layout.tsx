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
    // <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
    //   {/* Logo / Brand Section with Full Header */}
    //   <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-lg">
    //     <div className="flex items-center gap-3">
    //       {/* Logo Image */}
    //       <div className="relative">
    //         <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl ring-2 ring-white/40 p-1.5">
    //           <img 
    //             src="/images/gleam-logo.png" 
    //             alt="GLEAM Logo" 
    //             className="w-full h-full object-contain"
    //           />
    //         </div>
    //         <div className="absolute inset-0 w-12 h-12 rounded-2xl bg-white/10 animate-ping"></div>
    //       </div>
          
    //       {/* Brand Text */}
    //       <div className="flex-1">
    //         <h2 className="font-bold text-xl text-white drop-shadow-md">GLEAM</h2>
    //         <p className="text-[10px] leading-tight text-emerald-50 font-medium">Glucose, Learning, Education,<br/>and Monitoring</p>
    //       </div>
    //     </div>
    //   </div>

    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ===== Sidebar (Fixed Left) ===== */}
      <aside className="w-72 flex-shrink-0 shadow-2xl">
        <Sidebar role={sidebarRole} />
      </aside>

      {/* ===== Main Content Area ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        {/* <header className="h-20 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="h-full px-6 flex items-center justify-between"> */}
            {/* Search Bar */}
            {/* <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Cari menu, fitur, atau konten..."
                  className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 rounded-xl"
                />
              </div>
            </div> */}

            {/* Right Actions */}
            {/* <div className="flex items-center gap-4">
              {/* Notification Button */}
              {/* <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </Button> */} 

              {/* User Info */}
              {/* <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div> */}
        {/* </header> */}

        {/* Main Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
    // </div>
  );
}
