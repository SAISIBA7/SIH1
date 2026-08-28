import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { username, password, fullName, role = 'farmer' } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: { code: "validation_error", message: "Username and password are required." } },
        { status: 400 }
      );
    }

    const userId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      message: "User registered successfully",
      userId,
      role
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "registration_error", message: err.message || "Registration failed." } },
      { status: 500 }
    );
  }
}
