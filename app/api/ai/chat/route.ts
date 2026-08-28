import { NextRequest, NextResponse } from 'next/server';
import { generateAIChatResponse } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = body.message || 'What fertilizer should I apply for yellowing leaves?';
    const response = await generateAIChatResponse(message, body.context);
    return NextResponse.json({ success: true, answer: response });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
