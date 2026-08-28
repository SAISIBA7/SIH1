import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '18.52');
  const lon = parseFloat(searchParams.get('lon') || '73.85');

  return NextResponse.json({
    state: "Odisha",
    district: "Mayurbhanj",
    block: "Baripada",
    season: "Kharif-Rabi",
    coordinates: { lat, lon }
  }, { status: 200 });
}
