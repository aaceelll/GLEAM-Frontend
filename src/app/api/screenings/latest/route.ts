import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Ambil screening terbaru
    const [latestRows] = await db.query(
      `SELECT * FROM diabetes_screenings 
       ORDER BY created_at DESC 
       LIMIT 1`
    );

    // Ambil history 10 screening terakhir
    const [historyRows] = await db.query(
      `SELECT * FROM diabetes_screenings 
       ORDER BY created_at DESC 
       LIMIT 10`
    );

    return NextResponse.json({
      latest: (latestRows as any[])[0] || null,
      history: historyRows as any[] || []
    });
  } catch (error) {
    console.error('Error fetching screening results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
