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

    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'credentials',
          providerAccountId: email,
        },
      },
    });

    if (existingAccount) {
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword, // Storing this on the User model for now, though it's tied to the credentials account
        accounts: {
          create: {
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: email,
          },
        },
      },
    });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}