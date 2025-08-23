// src/app/api/auth/unlink-account/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { provider } = await request.json();

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!provider) {
      return new NextResponse('Provider is required', { status: 400 });
    }

    // Find the account to be unlinked
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: provider,
      },
    });

    if (!account) {
      return new NextResponse('Account not found or already unlinked.', { status: 404 });
    }

    // Prevent unlinking the last account if no password is set
    const totalAccounts = await prisma.account.count({ where: { userId: session.user.id } });
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    if (totalAccounts <= 1 && !user?.hashedPassword) {
      return new NextResponse('Cannot unlink the only sign-in method for an account without a password.', { status: 400 });
    }

    // Delete the account
    await prisma.account.delete({
      where: {
        id: account.id,
      },
    });

    return new NextResponse('Account unlinked successfully.', { status: 200 });
  } catch (error) {
    console.error('Unlink Account Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
