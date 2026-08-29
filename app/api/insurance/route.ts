import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get("farmerId");

    if (!farmerId) {
      return NextResponse.json({ error: "farmerId is required" }, { status: 400 });
    }

    const insuranceRecords = await prisma.insurance.findMany({
      where: { farmerId },
    });

    return NextResponse.json(insuranceRecords);
  } catch (error) {
    console.error("Error fetching insurance records:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
