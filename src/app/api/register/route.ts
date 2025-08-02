// src/app/api/register/route.ts

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse('Missing email or password', { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse('User with this email already exists', { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        // You can set a default name or leave it null
        name: email.split('@')[0], 
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}