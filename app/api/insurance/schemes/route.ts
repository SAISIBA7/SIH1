import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const schemes = await prisma.scheme.findMany({
      include: {
        bank: true,
      },
      where: {
        status: "available",
      },
    });

    return NextResponse.json(schemes);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
