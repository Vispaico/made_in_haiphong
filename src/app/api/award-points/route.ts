// src/app/api/award-points/route.ts
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import TravelPoints from '@/../artifacts/contracts/TravelPoints.sol/TravelPoints.json';
import { serverEnv } from '@/env/server';
import { clientEnv } from '@/env/client';
import { awardPointsSchema } from '@/lib/validators';
import { logger } from '@/lib/logger';

// This is a protected API route. In a real app, you would secure this
// to ensure it can only be called by your backend services after a
// confirmed booking. For example, by checking for a secret API key.

export async function POST(request: Request) {
  if (!serverEnv.DEPLOY_NETWORK_URL || !serverEnv.ADMIN_PRIVATE_KEY || !clientEnv.NEXT_PUBLIC_CONTRACT_ADDRESS) {
    return NextResponse.json({ error: 'On-chain configuration is not available.' }, { status: 503 });
  }

  const parsed = awardPointsSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { recipientAddress, amount } = parsed.data;

  try {
      const provider = new ethers.providers.JsonRpcProvider(serverEnv.DEPLOY_NETWORK_URL);
      const wallet = new ethers.Wallet(serverEnv.ADMIN_PRIVATE_KEY!, provider);
      const contract = new ethers.Contract(
        clientEnv.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        TravelPoints.abi,
        wallet
      );

    // Convert the amount to the correct unit (e.g., wei for 18 decimals)
    const amountToSend = ethers.utils.parseUnits(amount.toString(), 18);

    const tx = await contract.awardPoints(recipientAddress, amountToSend);
    await tx.wait();

    return NextResponse.json({ message: 'Points awarded successfully!', transactionHash: tx.hash });
  } catch (error: any) {
    logger.error({ error }, 'Failed to award points');
    return NextResponse.json({ error: 'Failed to award points.', details: error.message }, { status: 500 });
  }
}
