import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // TODO: Replace with actual user registration logic
    // - Check if user already exists
    // - Hash password
    // - Save to database
    // - Generate JWT token or session

    // Mock response - replace with real registration
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Simulate successful registration
    const user = {
      id: '1',
      name: name,
      email: email,
    };

    // After signup, always require email verification
    // TODO: Generate and send OTP via email
    return NextResponse.json(
      {
        success: true,
        requiresOTP: true,
        requiresVerification: true,
        message: 'Account created! Please verify your email with the OTP sent to your inbox',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
