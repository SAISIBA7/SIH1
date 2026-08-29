import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Logout successful"
  }, { status: 200 });

  response.cookies.set('smartcrop_token', '', { path: '/', maxAge: 0 });
  response.cookies.set('smartcrop_session', '', { path: '/', maxAge: 0 });

  return response;
}
