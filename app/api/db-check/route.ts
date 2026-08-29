import { NextResponse } from 'next/server';
import { checkDbConnection, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const health = await checkDbConnection();
    if (!health.success) {
      return NextResponse.json(
        {
          status: 'error',
          connected: false,
          error: health.message,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
        },
        { status: 500 }
      );
    }

    // Attempt to list existing tables or database version
    let tables: any[] = [];
    try {
      tables = await query('SHOW TABLES;');
    } catch {
      tables = [];
    }

    return NextResponse.json({
      status: 'success',
      connected: true,
      message: health.message,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      tables,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'error',
        connected: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
