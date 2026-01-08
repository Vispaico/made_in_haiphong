// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { emailOnlySchema } from '@/lib/validators';
import { serverEnv } from '@/env/server';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const parsed = emailOnlySchema.safeParse(await request.json());

    if (!parsed.success) {
      return new NextResponse('Invalid email address', { status: 400 });
    }

    const { email } = parsed.data;

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      // We don't want to reveal if a user exists or not
      return new NextResponse('If your email is in our system, you will receive a password reset link.', { status: 200 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    if (!serverEnv.NEXTAUTH_URL || !serverEnv.EMAIL_SERVER_HOST || !serverEnv.EMAIL_SERVER_PORT || !serverEnv.EMAIL_SERVER_USER || !serverEnv.EMAIL_SERVER_PASSWORD || !serverEnv.EMAIL_FROM) {
      logger.error('Missing email server environment variables for password reset');
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    const resetLink = `${serverEnv.NEXTAUTH_URL}/reset-password/${token}`;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: serverEnv.EMAIL_SERVER_HOST,
      port: Number(serverEnv.EMAIL_SERVER_PORT),
      secure: Number(serverEnv.EMAIL_SERVER_PORT) === 465, // Use SSL for port 465
      auth: {
        user: serverEnv.EMAIL_SERVER_USER,
        pass: serverEnv.EMAIL_SERVER_PASSWORD,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: serverEnv.EMAIL_FROM,
        to: email,
        subject: 'Reset Your Password for Made in Haiphong',
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
      });
      logger.info({ response: info.response }, 'Password reset email sent');

    } catch (emailError) {
      logger.error({ emailError }, 'Failed to send password reset email');
      // We still don't want to leak information, but we need to know about the error.
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    return new NextResponse('If your email is in our system, you will receive a password reset link.', { status: 200 });
  } catch (error) {
    logger.error({ error }, 'Forgot Password Error');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
