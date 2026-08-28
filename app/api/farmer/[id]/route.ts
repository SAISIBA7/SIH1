import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: farmerId } = await params;

    if (!farmerId) {
      return NextResponse.json({ error: "Farmer ID is required" }, { status: 400 });
    }

    const farmer = await prisma.farmer.findUnique({
      where: { id: farmerId },
      include: {
        farms: {
          include: {
            crops: {
              include: {
                riskScores: {
                  orderBy: { createdAt: "desc" },
                  take: 1
                }
              }
            }
          }
        },
        farmerBankAccounts: {
          include: {
            bank: true
          }
        },
        loans: {
          include: {
            bank: true,
            loanPayments: {
              orderBy: { paymentDate: "desc" },
              take: 5
            }
          }
        },
        insurance: true,
        schemeApplications: {
          include: {
            scheme: true
          }
        }
      },
    });

    if (!farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
    }

    // In a real application, you might also fetch dynamic data like weather here using OpenWeatherMap API
    // from the farms' lat/lng, but for the basic profile we return the DB entity.

    return NextResponse.json(farmer);
  } catch (error) {
    console.error("Error fetching farmer profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
