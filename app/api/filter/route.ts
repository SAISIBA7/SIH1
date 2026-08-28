import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '18.52');
  const lon = parseFloat(searchParams.get('lon') || '73.85');

  const filteredCrops = [
    { name: "Paddy (Swarna MTU 7029)", suitability: "High", water_need: "Medium-High", season: "Kharif" },
    { name: "Finger Millet (Ragi GPU-28)", suitability: "Very High", water_need: "Low", season: "Kharif-Rabi" },
    { name: "Black Gram (Urad Prasad)", suitability: "High", water_need: "Low", season: "Rabi" },
    { name: "Mustard (PT-303)", suitability: "High", water_need: "Medium", season: "Rabi" }
  ];

  return NextResponse.json({
    crops: filteredCrops,
    count: filteredCrops.length,
    coordinates: { lat, lon }
  }, { status: 200 });
}
