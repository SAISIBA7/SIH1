import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json({
    loanId: id,
    status: "rejected",
    message: `Loan ${id} rejected.`
  }, { status: 200 });
}
