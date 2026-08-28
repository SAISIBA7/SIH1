import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const loan = {
    loanId: id,
    farmerId: "FRM-7821",
    farmerName: "Ramesh Chandra Mohapatra",
    village: "Baripada, Mayurbhanj",
    amount: 65000,
    purpose: "KCC Crop Input & Fertilizer",
    status: "approved",
    interestRate: "4.0% (with Subvention)",
    disbursementDate: "2026-09-05",
    bank: "State Bank of India - Baripada Hub"
  };

  return NextResponse.json(loan, { status: 200 });
}
