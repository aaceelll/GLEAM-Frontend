// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function roleToSegment(role?: string) {
  if (!role) return "user";
  if (role === "super_admin" || role === "admin") return "admin";
  if (role === "manajemen") return "manajemen";
  if (role === "nakes") return "nakes";
  return "user";
}

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

 // === (A) Setelah logout, tahan semua halaman auth publik di /login ===
 const justLoggedOut = req.cookies.get("just_logged_out")?.value === "1";
 const isPublicAuth =
   pathname === "/forgot-password" ||
   pathname === "/reset-password"  ||
   pathname.startsWith("/reset-password/");
 if (justLoggedOut && isPublicAuth) {
   const url = new URL("/login", origin);
   const res = NextResponse.redirect(url);
   res.headers.set("Cache-Control", "no-store, private, max-age=0, must-revalidate");
   return res;
 }

  // Hanya proteksi /dashboard/*
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token")?.value;
  const roleCookie = req.cookies.get("role")?.value || "";
  const segByRole = roleToSegment(roleCookie);
  const myHome = `/dashboard/${segByRole}`;

  // 1) Belum login → /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  // 2) /dashboard root → redirect ke home by role
  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(myHome, origin));
  }

  // 3) Cegah akses silang role
  const [, , seg] = pathname.split("/");
  if (seg && seg !== segByRole) {
    return NextResponse.redirect(new URL(myHome, origin));
  }

  // 4) Anti-cache untuk halaman proteksi (hindari muncul dari bfcache saat Back)
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, private, max-age=0, must-revalidate");
  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/forgot-password",
    "/reset-password",
    "/reset-password/:path*",
  ],
};
