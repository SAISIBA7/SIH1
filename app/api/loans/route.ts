import { NextRequest, NextResponse } from 'next/server';

let loansStore = [
  { loanId: "LN-789", farmerId: "FRM-7821", farmerName: "Ramesh Chandra Mohapatra", amount: 65000, purpose: "KCC Crop Input & Fertilizer", status: "pending", createdAt: "2026-08-27" },
  { loanId: "LN-790", farmerId: "FRM-6190", farmerName: "Basanti Murmu", amount: 35000, purpose: "Drip Micro-Irrigation Kit", status: "pending", createdAt: "2026-08-28" },
  { loanId: "LN-791", farmerId: "FRM-5034", farmerName: "Biren Kumar Sethi", amount: 120000, purpose: "Solar Water Pump Subsidy Match", status: "approved", createdAt: "2026-08-20" }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');

  let results = loansStore;
  if (statusFilter) {
    results = results.filter(l => l.status.toLowerCase() === statusFilter.toLowerCase());
  }

  return NextResponse.json(results, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { farmerId = "FRM-7821", amount, purpose = "Crop Cultivation" } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: { code: "validation_error", message: "Amount must be positive.", field: "amount" } },
        { status: 400 }
      );
    }

    const newLoan = {
      loanId: `LN-${Math.floor(800 + Math.random() * 9000)}`,
      farmerId,
      farmerName: body.farmerName || "Ramesh Chandra Mohapatra",
      amount: Number(amount),
      purpose,
      status: "pending",
      createdAt: new Date().toISOString().split('T')[0]
    };

    loansStore.unshift(newLoan);

    return NextResponse.json({
      loanId: newLoan.loanId,
      status: "pending",
      message: "Loan application submitted successfully."
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "loan_error", message: err.message || "Failed to create loan application." } },
      { status: 500 }
    );
  }
}
