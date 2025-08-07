// src/app/api/register/route.ts

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// THE FIX: This regex is updated to include the special character requirement, matching the form's helper text.
const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export async function POST(req: Request) {
  try {
    // THE FIX: We now correctly expect 'name' from the request body, in addition to email and password.
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing name, email, or password' }, { status: 400 });
    }

    if (!passwordStrengthRegex.test(password)) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.' },
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
        name, // Use the name provided from the form.
      },
    });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}