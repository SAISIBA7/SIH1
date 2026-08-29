import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * PATCH /api/notifications/read-all — Mark all notifications as read for a farmer.
 * Body: { farmerId: string }
 */
export async function PATCH(req: NextRequest) {
  let connection;

  try {
    connection = await pool.getConnection();
    const body = await req.json();
    const farmerId = body.farmerId || 'FRM_47166869_622';

    const [result]: any = await connection.query(
      'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE farmer_id = ? AND is_read = 0',
      [farmerId]
    );

    return NextResponse.json({
      success: true,
      message: `Marked ${result.affectedRows} notifications as read`,
      data: { markedCount: result.affectedRows }
    });
  } catch (error: any) {
    console.error('Mark all read error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
