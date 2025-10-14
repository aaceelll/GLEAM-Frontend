// app/api/patients/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

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

  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  // === PRODUKSI: proxy ke Laravel ===
  if (isProd) {
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

  // === LOKAL: query DB langsung (kode lamamu) ===
  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE role = 'user' AND nama LIKE ? LIMIT 10",
      [`%${q}%`]
    );
    const patients = (rows as any[]).map((row: any) => ({
      id: row.id,
      nama: row.nama,
      umur: row.umur || 0,
      jenis_kelamin: row.jenis_kelamin || "",
      riwayat_pelayanan_kesehatan: row.riwayat_pelayanan_kesehatan || "",
      riwayat_penyakit_jantung: row.riwayat_penyakit_jantung || "Tidak",
      riwayat_merokok: row.riwayat_merokok || "Tidak Pernah Merokok",
      bmi: row.bmi || row.indeks_bmi || 0,
      indeks_bmi: row.indeks_bmi || row.bmi || 0,
    }));
    return NextResponse.json({ patients });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to search patients (local DB)", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
