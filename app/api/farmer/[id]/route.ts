import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let farmer = await prisma.farmer.findUnique({
      where: { id },
      include: {
        insurance: true,
        crops: true,
        farms: true,
      },
    });

    if (!farmer) {
      // Fallback: get the first farmer in the database for demonstration purposes
      farmer = await prisma.farmer.findFirst({
        include: {
          insurance: true,
          crops: true,
          farms: true,
        },
      });
      
      if (!farmer) {
        return NextResponse.json({ error: 'No farmers found in the database' }, { status: 404 });
      }
    }

    return NextResponse.json(farmer);
  } catch (error) {
    console.error('Error fetching farmer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
