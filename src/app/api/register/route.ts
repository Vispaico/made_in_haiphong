// src/app/api/register/route.ts

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// Regular expression to check for password strength
const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    if (!passwordStrengthRegex.test(password)) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        name: email.split('@')[0], 
      },
    });

    // The API's only job is to create the user and report success.
    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}