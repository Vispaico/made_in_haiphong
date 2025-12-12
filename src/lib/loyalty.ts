import prisma from '@/lib/prisma';
import TravelPoints from '@/../artifacts/contracts/TravelPoints.sol/TravelPoints.json';
import { ethers } from 'ethers';

const hasOnChainConfig = () =>
  Boolean(process.env.DEPLOY_NETWORK_URL && process.env.ADMIN_PRIVATE_KEY && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

type AwardPayload = {
  userId: string;
  points: number;
};

export async function awardLoyaltyPoints({ userId, points }: AwardPayload) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { loyaltyBalance: { increment: points } },
    select: { id: true, walletAddress: true },
  });

  if (user.walletAddress && hasOnChainConfig()) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(process.env.DEPLOY_NETWORK_URL);
      const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY!, provider);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
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
