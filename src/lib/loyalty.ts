import prisma from '@/lib/prisma';
import TravelPoints from '@/../artifacts/contracts/TravelPoints.sol/TravelPoints.json';
import { ethers } from 'ethers';
import { serverEnv } from '@/env/server';
import { clientEnv } from '@/env/client';

const hasOnChainConfig = () =>
  Boolean(serverEnv.DEPLOY_NETWORK_URL && serverEnv.ADMIN_PRIVATE_KEY && clientEnv.NEXT_PUBLIC_CONTRACT_ADDRESS);

type AwardPayload = {
  userId: string;
  points: number;
  reason: string;
  sourceId?: string;
  sourceType?: string;
};

export async function awardLoyaltyPoints({ userId, points, reason, sourceId, sourceType }: AwardPayload) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { loyaltyBalance: { increment: points } },
    select: { id: true, walletAddress: true },
  });

  await prisma.loyaltyTransaction.create({
    data: {
      userId,
      points,
      reason,
      sourceId,
      sourceType,
    },
  });

  if (user.walletAddress && hasOnChainConfig()) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(serverEnv.DEPLOY_NETWORK_URL!);
      const wallet = new ethers.Wallet(serverEnv.ADMIN_PRIVATE_KEY!, provider);
      const contract = new ethers.Contract(
        clientEnv.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        TravelPoints.abi,
        wallet,
      );
      const amount = ethers.utils.parseUnits(points.toString(), 18);
      const tx = await contract.awardPoints(user.walletAddress, amount);
      await tx.wait();
    } catch (error) {
      console.error('On-chain loyalty award failed', error);
    }
  }

  return user;
}
