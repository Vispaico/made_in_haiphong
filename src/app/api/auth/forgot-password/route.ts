// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

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

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

    if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_PORT || !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD || !process.env.EMAIL_FROM) {
      console.error('Missing email server environment variables');
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset Your Password for Made in Haiphong',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    return new NextResponse('If your email is in our system, you will receive a password reset link.', { status: 200 });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
