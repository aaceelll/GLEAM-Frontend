import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function apiBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  return raw.replace(/\/+$/, "");
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ patients: [] });

  try {
    const token =
      cookies().get("auth_token")?.value ||
      cookies().get("gleam_token")?.value ||
      "";

    const upstream = `${apiBase()}/patients/search?q=${encodeURIComponent(q)}`;

    const r = await fetch(upstream, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    const text = await r.text();

    if (!r.ok) {
      return new NextResponse(text || JSON.stringify({ error: "Upstream error" }), {
        status: r.status,
        headers: { "Content-Type": r.headers.get("content-type") ?? "application/json" },
      });
    }

    let data: any = {};
    try { data = JSON.parse(text); } catch {}

    const patients = data?.patients ?? data?.data ?? [];
    return NextResponse.json({ patients });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Proxy error" }, { status: 500 });
  }
}
