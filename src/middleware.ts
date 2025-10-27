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

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token")?.value;
  const roleCookie = req.cookies.get("role")?.value || "";
  const segByRole = roleToSegment(roleCookie);
  const myHome = `/dashboard/${segByRole}`;

  // 1) Belum login → ke /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  // 2) /dashboard (root) → rumah sesuai role
  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(myHome, origin));
  }

  // 3) Blokir akses silang role (misal user buka /dashboard/nakes)
  const [, , seg] = pathname.split("/");
  if (seg && seg !== segByRole) {
    return NextResponse.redirect(new URL(myHome, origin));
  }

  // 4) (Opsional) pengecualian untuk halaman tertentu user
  // const isPersonalInfoPage = pathname === "/dashboard/user/personal-info";
  // if (segByRole === "user" && !isPersonalInfoPage) { ... }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
