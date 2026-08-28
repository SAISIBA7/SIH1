import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { username, password, email, role } = body;

    const identifier = username || email;
    if (!identifier || !password) {
      return NextResponse.json(
        { error: { code: "validation_error", message: "Username/email and password are required." } },
        { status: 400 }
      );
    }

    // Role mapping detection
    let userRole = role || 'farmer';
    if (identifier.toLowerCase().includes('admin') || identifier.toLowerCase().includes('officer')) {
      userRole = 'admin';
    } else if (identifier.toLowerCase().includes('bank')) {
      userRole = 'bank';
    }

    // Generate authenticated JWT simulation
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify({
      id: `USR-${Date.now().toString().slice(-4)}`,
      username: identifier,
      role: userRole,
      exp: Math.floor(Date.now() / 1000) + 3600 * 24
    })).toString('base64url')}.smartcrop_signature`;

    const refreshToken = `eyRefreshToken.${Date.now()}.${Math.random().toString(36).substring(2)}`;

    const user = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      username: identifier,
      fullName: userRole === 'farmer' ? 'Ramesh Chandra Mohapatra' : userRole === 'admin' ? 'Satyajit Jena (Agriculture Officer)' : 'State Bank of India - Baripada Hub',
      role: userRole
    };

    return NextResponse.json({
      accessToken,
      refreshToken,
      user
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "auth_error", message: err.message || "Authentication failed." } },
      { status: 500 }
    );
  }
}
