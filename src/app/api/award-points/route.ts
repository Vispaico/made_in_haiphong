// src/app/api/award-points/route.ts
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import TravelPoints from '@/../artifacts/contracts/TravelPoints.sol/TravelPoints.json';

// This is a protected API route. In a real app, you would secure this
// to ensure it can only be called by your backend services after a
// confirmed booking. For example, by checking for a secret API key.

export async function POST(request: Request) {
  const { recipientAddress, amount } = await request.json();

  if (!recipientAddress || !amount) {
    return NextResponse.json({ error: 'Recipient address and amount are required.' }, { status: 400 });
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.DEPLOY_NETWORK_URL);
    const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      TravelPoints.abi,
      wallet
    );

    // Convert the amount to the correct unit (e.g., wei for 18 decimals)
    const amountToSend = ethers.utils.parseUnits(amount.toString(), 18);

    const tx = await contract.awardPoints(recipientAddress, amountToSend);
    await tx.wait();

    return NextResponse.json({ message: 'Points awarded successfully!', transactionHash: tx.hash });
  } catch (error: any) {
    console.error('Failed to award points:', error);
    return NextResponse.json({ error: 'Failed to award points.', details: error.message }, { status: 500 });
  }
}
