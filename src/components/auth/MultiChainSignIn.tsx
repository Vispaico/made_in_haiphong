// src/components/auth/MultiChainSignIn.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useAccount, useSignMessage } from 'wagmi';
import { useWallet, useSignMessage as useSolanaSignMessage } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/Button';
import { createChallenge } from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';

export function MultiChainSignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<null | 'ethereum' | 'solana'>(null);
  const [error, setError] = useState<string | null>(null);

  // === Ethereum Hooks ===
  const { address: ethAddress, isConnected: isEthConnected } = useAccount();
  const { signMessageAsync: signEthMessage } = useSignMessage();

  // === Solana Hooks ===
  const { publicKey: solPublicKey, connected: isSolConnected, signMessage: signSolMessage } = useWallet();

  const handleSignIn = async (chain: 'ethereum' | 'solana') => {
    setIsLoading(chain);
    setError(null);

    try {
      let address: string | undefined;
      if (chain === 'ethereum' && isEthConnected) address = ethAddress;
      if (chain === 'solana' && isSolConnected) address = solPublicKey?.toBase58();

      if (!address) {
        setError(`Please connect your ${chain} wallet first.`);
        setIsLoading(null);
        return;
      }

      // 1. Get challenge message from backend
      const { message, nonce } = await createChallenge(address, chain);

      // 2. Sign the message
      let signature: string | undefined;
      if (chain === 'ethereum') {
        signature = await signEthMessage({ message });
      } else if (chain === 'solana' && signSolMessage) {
        const signedMessage = await signSolMessage(new TextEncoder().encode(message));
        signature = Buffer.from(signedMessage).toString('hex');
      }

      if (!signature) throw new Error('Failed to sign message.');

      // 3. Call NextAuth to sign in
      const result = await signIn('web3', {
        redirect: false,
        message,
        signature,
        address,
        chain,
        nonce,
      });

      if (result?.error) throw new Error(result.error);
      
      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message || `An error occurred during ${chain} sign-in.`);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      
      <Button
        onClick={() => handleSignIn('ethereum')}
        disabled={!isEthConnected || isLoading === 'ethereum'}
        className="w-full"
      >
        {isLoading === 'ethereum' ? 'Signing in...' : 'Sign in with Ethereum'}
      </Button>

      <div className="flex flex-col items-center space-y-2">
        <WalletMultiButton />
        {isSolConnected && (
          <Button
            onClick={() => handleSignIn('solana')}
            disabled={isLoading === 'solana'}
            className="w-full"
          >
            {isLoading === 'solana' ? 'Signing in...' : 'Sign in with Solana'}
          </Button>
        )}
      </div>
    </div>
  );
}
