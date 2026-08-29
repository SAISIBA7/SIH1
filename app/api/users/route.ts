import { NextRequest, NextResponse } from 'next/server';

const usersStore = [
  { id: "USR-101", username: "farmer_ramesh", fullName: "Ramesh Chandra Mohapatra", role: "farmer", status: "active", village: "Baripada", createdAt: "2026-08-20" },
  { id: "USR-102", username: "farmer_basanti", fullName: "Basanti Murmu", role: "farmer", status: "pending", village: "Betnoti", createdAt: "2026-08-27" },
  { id: "USR-103", username: "officer_satyajit", fullName: "Satyajit Jena", role: "admin", status: "active", village: "Baripada Block Office", createdAt: "2026-08-10" },
  { id: "USR-104", username: "bank_sbi_baripada", fullName: "SBI Baripada Agri Hub", role: "bank", status: "active", village: "Main Market Branch", createdAt: "2026-08-15" }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');

  let results = usersStore;
  if (statusFilter) {
    results = results.filter(u => u.status.toLowerCase() === statusFilter.toLowerCase());
  }

  return NextResponse.json(results, { status: 200 });
}
