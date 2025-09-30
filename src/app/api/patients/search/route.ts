import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ patients: [] });
    }

    const [rows] = await db.query(
      `SELECT * FROM users WHERE role = 'user' AND nama LIKE ? LIMIT 10`,
      [`%${query}%`]
    );

    // ✅ Map data dengan field yang benar dan default values yang sesuai
    const patients = (rows as any[]).map((row: any) => ({
      id: row.id,
      nama: row.nama,
      umur: row.umur || 0,
      jenis_kelamin: row.jenis_kelamin || '',
      riwayat_pelayanan_kesehatan: row.riwayat_pelayanan_kesehatan || '',
      // ✅ DITAMBAHKAN: Field yang hilang!
      riwayat_penyakit_jantung: row.riwayat_penyakit_jantung || 'Tidak',
      // ✅ DIPERBAIKI: Format sesuai ENUM database
      riwayat_merokok: row.riwayat_merokok || 'Tidak Pernah Merokok',
      bmi: row.bmi || row.indeks_bmi || 0,
      indeks_bmi: row.indeks_bmi || row.bmi || 0
    }));

    console.log('Patients found:', patients); // ✅ Debug log

    return NextResponse.json({ patients });
  } catch (error) {
    console.error('Error searching patients:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to search patients', 
      details: errorMessage 
    }, { status: 500 });
  }
}