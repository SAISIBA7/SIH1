import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = {
    id,
    username: "farmer_basanti",
    fullName: "Basanti Murmu",
    phone: "+91 94371 88290",
    role: "farmer",
    status: "approved",
    district: "Mayurbhanj",
    village: "Betnoti",
    landArea: "2.5 Acres",
    kycVerified: true,
    registeredAt: "2026-08-27"
  };

  return NextResponse.json(user, { status: 200 });
}
