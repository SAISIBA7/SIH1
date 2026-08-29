import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-jwt';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Enforce Bank or Administrator authentication
  const authResult = requireAuth(req, ['bank', 'administrator', 'admin']);
  if (authResult.errorResponse) {
    return authResult.errorResponse;
  }

  const { id } = await params;

  if (!id || typeof id !== 'string') {
    return NextResponse.json(
      { error: { code: 'bad_request', message: 'Loan ID parameter is required.' } },
      { status: 400 }
    );
  }

  return NextResponse.json({
    loanId: id,
    status: "rejected",
    rejectedBy: authResult.user.name,
    officerRole: authResult.user.role,
    message: `Loan application ${id} was rejected by ${authResult.user.name}.`
  }, { status: 200 });
}
