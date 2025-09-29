import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("auth_token")?.value
    
    if (!token) {
      return NextResponse.redirect(new URL("/login/user", req.url))
    }

    // Check if user needs to complete profile (kecuali sedang di halaman personal-info)
    const isPersonalInfoPage = req.nextUrl.pathname === "/dashboard/user/personal-info"
    
    if (!isPersonalInfoPage) {
      // Bisa ditambahkan pengecekan ke API untuk cek has_completed_profile
      // Tapi untuk saat ini kita skip dulu karena perlu decode JWT atau hit API
      // Yang akan menambah latency di middleware
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}