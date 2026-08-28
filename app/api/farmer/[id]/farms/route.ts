import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const farmerId = params.id;
    if (!farmerId) return NextResponse.json({ error: "Farmer ID required" }, { status: 400 });

    const farms = await prisma.farm.findMany({
      where: { farmerId },
      include: {
        crops: {
          include: {
            riskScores: true,
          }
        }
      }
    });

    return NextResponse.json(farms);
  } catch (error) {
    console.error("Error fetching farms:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const farmerId = params.id;
    if (!farmerId) return NextResponse.json({ error: "Farmer ID required" }, { status: 400 });

    const body = await request.json();
    const { name, latitude, longitude, area, soilType, village, district } = body;

    const farmId = `FARM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const newFarm = await prisma.farm.create({
      data: {
        id: farmId,
        farmerId,
        name,
        latitude,
        longitude,
        area,
        soilType,
        village,
        district
      }
    });

    return NextResponse.json(newFarm, { status: 201 });
  } catch (error) {
    console.error("Error creating farm:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
