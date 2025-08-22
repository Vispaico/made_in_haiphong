// src/components/profile/LoyaltyBalance.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { ethers } from 'ethers';
import TravelPoints from '@/../artifacts/contracts/TravelPoints.sol/TravelPoints.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export function LoyaltyBalance() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState('0');

  const { data, isError, isLoading } = useReadContract({
    address: contractAddress,
    abi: TravelPoints.abi,
    functionName: 'balanceOf',
    args: [address],
  });

  useEffect(() => {
    if (data) {
      // The balance is returned as a BigNumber in ethers v5, format it
      setBalance(ethers.utils.formatUnits(data as ethers.BigNumber, 18));
    }
  }, [data]);

  if (!isConnected) {
    return <p className="text-foreground/60">Please connect your wallet to see your TravelPoints balance.</p>;
  }

  return (
    <div className="p-4 bg-secondary rounded-lg">
      <h3 className="font-heading text-xl font-bold text-foreground">Your Loyalty Balance</h3>
      {isLoading && <p>Loading balance...</p>}
      {isError && <p className="text-red-500">Could not fetch balance.</p>}
      {!isLoading && !isError && (
        <p className="text-3xl font-bold text-primary">{balance} TRVL</p>
      )}
    </div>
  );
}
