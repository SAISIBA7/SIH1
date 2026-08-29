import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const schemes = await prisma.scheme.findMany();
    
    // Map to the structure expected by the frontend
    const mappedSchemes = schemes.map((s) => ({
      schemeId: s.id,
      schemeName: s.name,
      coverage: 100000, 
      premium: 500,
      bank: {
        id: 'bank-gov',
        bankName: 'Government Scheme'
      },
      status: 'available'
    }));

    return NextResponse.json(mappedSchemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
