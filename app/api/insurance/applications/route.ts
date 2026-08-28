import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get("farmerId");

    if (!farmerId) {
      return NextResponse.json({ error: "farmerId is required" }, { status: 400 });
    }

    const applications = await prisma.schemeApplication.findMany({
      where: { farmerId },
      include: {
        scheme: {
          include: { bank: true }
        }
      },
      orderBy: { appliedAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { farmerId, schemeId } = body;

    if (!farmerId || !schemeId) {
      return NextResponse.json({ error: "farmerId and schemeId are required" }, { status: 400 });
    }

    // Generate a simple ID for demo, usually this is handled by DB defaults if using uuid/cuid
    const applicationId = `APP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const newApplication = await prisma.schemeApplication.create({
      data: {
        applicationId,
        farmerId,
        schemeId,
        status: "pending",
      },
      include: {
        scheme: true,
      }
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
