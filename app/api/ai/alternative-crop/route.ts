import { NextRequest, NextResponse } from 'next/server';
import { generateAlternativeCropRecommendations } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const context = {
      currentCrop: body.currentCrop || 'Paddy (Paddy Field 2)',
      soilType: body.soilType || 'Red Loamy Soil',
      waterAvailability: body.waterAvailability || 'Low-Medium (Canal Deficit)',
      district: body.district || 'Mayurbhanj, Odisha'
    };

    const recommendations = await generateAlternativeCropRecommendations(context);
    return NextResponse.json({ success: true, data: recommendations });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
