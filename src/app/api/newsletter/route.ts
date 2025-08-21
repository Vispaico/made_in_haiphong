
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, fax } = await request.json();

    // Honeypot check
    if (fax) {
      return NextResponse.json({ message: 'Bot submission detected.' }, { status: 200 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Save the email to the database
    try {
      await prisma.newsletterSubscription.create({
        data: {
          email: email,
        },
      });
    } catch (error: any) {
      // Handle cases where the email is already subscribed (unique constraint violation)
      if (error.code === 'P2002') {
        return NextResponse.json({ message: 'You are already subscribed!' }, { status: 200 });
      }
      // Re-throw other errors
      throw error;
    }

    return NextResponse.json({ message: 'Thank you for subscribing!' }, { status: 200 });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 });
  }
}
