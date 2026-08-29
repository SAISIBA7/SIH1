import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * GET /api/notifications/[id] — Fetch a single notification detail from RDS.
 * Also marks the notification as read (server-side read-on-open per PRD §13).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;

  try {
    connection = await pool.getConnection();
    const { id } = await params;

    // Fetch notification detail
    const [rows]: any = await connection.query(
      `SELECT id, farmer_id, type, category, priority, title, message, body,
              voice_text, language, action_label, action_url, action_status,
              source_feature, source_entity_id, correlation_id,
              is_read, read_at, created_at
       FROM notifications WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    const n = rows[0];

    // Mark as read if not already (read-on-open per PRD §6/§13)
    if (!n.is_read) {
      await connection.query(
        'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ?',
        [id]
      );
    }

    // Fetch related notifications (same category, same farmer, excluding self)
    const [related]: any = await connection.query(
      `SELECT id, category, priority, title, message as description,
              action_label as ctaLabel, action_url as ctaHref,
              is_read, created_at as timestamp
       FROM notifications
       WHERE farmer_id = ? AND category = ? AND id != ?
       ORDER BY created_at DESC LIMIT 3`,
      [n.farmer_id, n.category || n.type, id]
    );

    const parsedBody = n.body ? (typeof n.body === 'string' ? JSON.parse(n.body) : n.body) : {
      whatHappened: n.message,
      whyReasons: ['Linked to your profile', `Your district — notification scope`],
      recommendedAction: 'Review the details and take necessary steps.'
    };

    return NextResponse.json({
      success: true,
      data: {
        id: n.id,
        category: n.category || n.type,
        priority: n.priority,
        title: n.title,
        description: n.message,
        timestamp: n.created_at,
        isRead: true, // Just marked as read
        actionStatus: n.action_status,
        body: parsedBody,
        voiceText: n.voice_text || `${n.title}. ${n.message}`,
        language: n.language || 'en',
        action: n.action_label ? {
          actionType: n.source_feature || 'VIEW_DETAILS',
          label: n.action_label,
          routeKey: n.action_url?.replace('/', '') || 'dashboard',
          params: { sourceEntityId: n.source_entity_id }
        } : null,
        relatedAlerts: related.map((r: any) => ({
          id: r.id,
          category: r.category,
          priority: r.priority,
          title: r.title,
          description: r.description,
          ctaLabel: r.ctaLabel,
          ctaHref: r.ctaHref,
          isRead: !!r.is_read,
          timestamp: r.timestamp,
        }))
      }
    });
  } catch (error: any) {
    console.error('Notification detail error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

/**
 * PATCH /api/notifications/[id] — Update notification (mark read, update action status)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;

  try {
    connection = await pool.getConnection();
    const { id } = await params;
    const body = await req.json();

    const updates: string[] = [];
    const values: any[] = [];

    if (body.isRead !== undefined) {
      updates.push('is_read = ?');
      values.push(body.isRead ? 1 : 0);
      if (body.isRead) {
        updates.push('read_at = NOW()');
      }
    }

    if (body.actionStatus) {
      updates.push('action_status = ?');
      values.push(body.actionStatus);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    values.push(id);
    await connection.query(
      `UPDATE notifications SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true, message: 'Notification updated' });
  } catch (error: any) {
    console.error('Notification update error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
