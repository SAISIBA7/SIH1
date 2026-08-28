import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json({
    userId: id,
    status: "rejected",
    message: `User account ${id} rejected.`
  }, { status: 200 });
}
