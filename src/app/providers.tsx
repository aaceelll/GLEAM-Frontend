"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { useEffect } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // Anti-bfcache: kalau user tekan Back dan halaman diambil dari cache, reload
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      // @ts-ignore
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);
  return <AuthProvider>{children}</AuthProvider>;
}
