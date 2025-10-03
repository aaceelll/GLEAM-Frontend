import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Query insert ke MySQL
    const [result] = await db.query(
      `INSERT INTO diabetes_screenings 
       (patient_name, user_id, nakes_id, age, gender, systolic_bp, 
        diastolic_bp, heart_disease, smoking_history, bmi, 
        blood_glucose_level, diabetes_probability, diabetes_result, 
        bp_classification, bp_recommendation, full_result, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        data.patientName,
        data.userId,
        data.nakesId,
        data.age,
        data.gender,
        data.systolic_bp,
        data.diastolic_bp,
        data.heart_disease,
        data.smoking_history,
        data.bmi,
        data.blood_glucose_level,
        data.diabetes_probability,
        data.diabetes_result,
        data.bp_classification,
        data.bp_recommendation,
        JSON.stringify(data.full_result ?? {})
      ]
    );

    return NextResponse.json({
      success: true,
      id: (result as any).insertId
    });
  } catch (error) {
    console.error('Error saving screening:', error);
    return NextResponse.json(
      { error: 'Failed to save screening' },
      { status: 500 }
    );
  }
}
