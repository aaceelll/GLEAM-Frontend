import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function apiBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL || '';
  return raw.replace(/\/+$/, '');
}

export async function GET() {
  try {
    const token =
      cookies().get('auth_token')?.value ||
      cookies().get('gleam_token')?.value ||
      '';

    const resp = await fetch(`${apiBase()}/screenings/latest`, {
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    const text = await resp.text();
    return new NextResponse(text, {
      status: resp.status,
      headers: { 'Content-Type': resp.headers.get('content-type') ?? 'application/json' },
    });
  } catch (error: any) {
    console.error('Proxy error fetching latest screenings:', error);
    return NextResponse.json(
      { error: error?.message || 'Proxy error' },
      { status: 500 }
    );
  }
}
