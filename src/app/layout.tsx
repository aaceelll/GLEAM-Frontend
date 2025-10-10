// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import "leaflet/dist/leaflet.css";  // 👈 TAMBAHKAN INI
import "leaflet.markercluster/dist/MarkerCluster.css";  // 👈 TAMBAHKAN INI
import "leaflet.markercluster/dist/MarkerCluster.Default.css";  // 👈

// ⬇️ pastikan file ini ada: src/components/ui/toaster.tsx (shadcn toast)
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "GLEAM",
  description: "Healthcare learning & monitoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
        {/* 🔔 toast container (wajib agar toast tampil) */}
        <Toaster />
      </body>
    </html>
  );
}
