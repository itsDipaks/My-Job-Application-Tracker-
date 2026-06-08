import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    // TODO: Replace with actual OTP verification logic
    // - Verify OTP from database/cache
    // - Check if OTP is expired
    // - Mark email as verified
    // - Generate JWT token

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    if (otp.length !== 6) {
      return NextResponse.json(
        { error: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    // Mock verification - replace with real logic
    // Check if OTP matches the one sent to the user
    const isValidOTP = true; // Replace with actual verification

    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Simulate successful verification
    const user = {
      id: '1',
      name: 'User',
      email: email,
    };

    return NextResponse.json(
      {
        success: true,
        user,
        token: 'mock-jwt-token', // Replace with real JWT
        message: 'Email verified successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'OTP verification failed' },
      { status: 500 }
    );
  }
}
