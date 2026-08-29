import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

type EquipmentRow = {
  id: string;
  name: string;
  type: string;
  owner: string;
  location: string;
  price_per_hour: string | number;
  availability: number;
};

export async function GET() {
  try {
    const rows: EquipmentRow[] = await query<EquipmentRow[]>(`
      SELECT id, name, type, owner, location, price_per_hour, availability
      FROM equipment
    `);

    const equipment = rows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.type,
      categorySlug: row.type.toLowerCase().replace(/\s+/g, '-'),
      provider: row.owner,
      location: row.location,
      availability: row.availability === 1 ? 'Available Now' : 'Unavailable',
      matchScore: '99% match',
      icon: '🔧',
      specs: '',
      rate: `₹${Number(row.price_per_hour)}`,
      unit: '/hour',
      distance: 'N/A',
      features: [],
    }));

    return NextResponse.json(equipment);
  } catch (error: any) {
    console.error('[API /api/equipment] Error fetching equipment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
