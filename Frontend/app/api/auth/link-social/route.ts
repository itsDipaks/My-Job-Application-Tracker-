import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual implementation
    // 1. Verify the user's password
    // const user = await db.user.findUnique({ where: { email } });
    // if (!user) {
    //   return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // }
    //
    // const isValidPassword = await bcrypt.compare(password, user.password_hash);
    // if (!isValidPassword) {
    //   return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    // }

    // 2. Get the pending social account link from session/temporary storage
    // const pendingLink = await db.pendingAccountLink.findFirst({
    //   where: {
    //     email,
    //     expiresAt: { gt: new Date() }
    //   }
    // });
    //
    // if (!pendingLink) {
    //   return NextResponse.json(
    //     { error: 'Link request expired. Please try signing in again.' },
    //     { status: 400 }
    //   );
    // }

    // 3. Create the social account link
    // await db.socialAccount.create({
    //   data: {
    //     userId: user.id,
    //     provider: pendingLink.provider,
    //     providerAccountId: pendingLink.providerAccountId,
    //     providerEmail: email,
    //   }
    // });

    // 4. Delete the pending link
    // await db.pendingAccountLink.delete({
    //   where: { id: pendingLink.id }
    // });

    // 5. Send confirmation email
    // await sendEmail({
    //   to: email,
    //   subject: 'Social Account Linked',
    //   template: 'account-linked',
    //   data: { provider: pendingLink.provider }
    // });

    // Mock successful response
    const user = {
      id: '1',
      name: 'User',
      email: email,
    };

    return NextResponse.json({
      success: true,
      user,
      token: 'mock-jwt-token', // Replace with real JWT
      message: 'Accounts linked successfully! You can now sign in with either method.',
    });
  } catch (error) {
    console.error('Link account error:', error);
    return NextResponse.json(
      { error: 'Failed to link accounts. Please try again.' },
      { status: 500 }
    );
  }
}
