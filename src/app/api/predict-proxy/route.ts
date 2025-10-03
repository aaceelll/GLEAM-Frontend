// app/api/predict-proxy/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log("Proxy received data:", body);
    
    const response = await fetch(
      "https://tcnisaa-prediksi-dm-adaboost.hf.space/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    
    console.log("HF Space response:", data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}