// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return new NextResponse('Token and password are required', { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return new NextResponse('Invalid or expired password reset token', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { hashedPassword },
    });

    // Invalidate the token
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    return new NextResponse('Password has been reset successfully.', { status: 200 });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
