// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "GLEAM",
  description: "Healthcare learning & monitoring",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

// ⬇️ penting untuk HP
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-dvh antialiased">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
