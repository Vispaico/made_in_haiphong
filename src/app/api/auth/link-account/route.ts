// src/app/api/auth/link-account/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyEthereumSignature, verifySolanaSignature } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const { address, signature, message, nonce, chain, userId } = await request.json();

    if (!address || !signature || !message || !nonce || !chain || !userId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // 1. Verify the signature
    let isValid = false;
    if (chain === 'ethereum') {
      isValid = await verifyEthereumSignature(message, signature, nonce);
    } else if (chain === 'solana') {
      isValid = verifySolanaSignature(message, signature, address);
    }

    if (!isValid) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    // 2. Check if this wallet is already linked to another account
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: chain,
          providerAccountId: address,
        },
      },
    });

    if (existingAccount) {
      return new NextResponse('This wallet is already linked to another account.', { status: 409 });
    }

    // 3. Link the new account to the user
    await prisma.account.create({
      data: {
        userId,
        provider: chain,
        providerAccountId: address,
        type: 'web3',
      },
    });
    
    // Also update the user's primary walletAddress if it's not set
    await prisma.user.update({
        where: { id: userId },
        data: { walletAddress: address },
    });

    return new NextResponse('Account linked successfully', { status: 200 });
  } catch (error) {
    console.error('Link Account Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
