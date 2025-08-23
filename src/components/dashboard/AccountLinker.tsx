// src/components/dashboard/AccountLinker.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Account } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { useConnect as useWagmiConnect, useSignMessage, useAccount } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { createChallenge } from '@/lib/auth-utils';

// Icons (assuming these are defined elsewhere or are simple enough to be here)
const EthereumIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.32l6.18 9.5-6.18 9.5-6.18-9.5L12 2.32zM12 12.5l6.18-3.18-6.18-6-6.18 6L12 12.5z" fill="currentColor"/></svg>;
const SolanaIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.22 12.1a3.25 3.25 0 00-1.04 2.24 3.25 3.25 0 003.25 3.25h1.04a3.25 3.25 0 001.04-2.25 3.25 3.25 0 00-3.25-3.25H4.22zM9.72 11.85a3.25 3.25 0 00-3.25 3.25 3.25 3.25 0 003.25 3.25h1.04a3.25 3.25 0 003.25-3.25 3.25 3.25 0 00-3.25-3.25H9.72zM4.22 6.35a3.25 3.25 0 00-1.04 2.25A3.25 3.25 0 006.43 11.8h1.04a3.25 3.25 0 001.04-2.25A3.25 3.25 0 005.26 6.3H4.22zM18.74 6.1a3.25 3.25 0 001.04-2.24A3.25 3.25 0 0016.53.6h-1.04a3.25 3.25 0 00-1.04 2.25c0 1.24.7 2.25 1.04 2.25h2.21zM13.24 6.35a3.25 3.25 0 003.25-3.25A3.25 3.25 0 0013.24.6h-1.04a3.25 3.25 0 00-3.25 3.25c0 1.24.7 2.25 3.25 2.25h1.04zM18.74 11.85a3.25 3.25 0 001.04-2.25 3.25 3.25 0 00-3.25-3.25h-1.04a3.25 3.25 0 00-1.04 2.25c0 1.24.7 2.25 1.04 2.25h2.21z" fill="currentColor"/></svg>;

interface AccountLinkerProps {
  accounts: Account[];
}

export default function AccountLinker({ accounts }: AccountLinkerProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<null | 'ethereum' | 'solana'>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Ethereum Hooks ---
  const { connectAsync: connectWagmi } = useWagmiConnect();
  const { signMessageAsync: signEthMessage } = useSignMessage();
  
  // --- Solana Hooks ---
  const { publicKey: solanaPublicKey, signMessage: signSolMessage, connected: isSolanaConnected } = useWallet();
  const { setVisible: setSolanaModalVisible } = useWalletModal();

  const isLinked = (provider: string) => accounts.some(acc => acc.provider === provider);

  const linkAccount = async (chain: 'ethereum' | 'solana', address: string, signature: string, message: string, nonce: string) => {
    const response = await fetch('/api/auth/link-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature, message, nonce, chain, userId: session?.user?.id }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Failed to link account.');
    }
    
    router.refresh();
  };

  const handleEthereumLink = async () => {
    setIsLoading('ethereum');
    setError(null);
    try {
      const { accounts } = await connectWagmi({ connector: injected() });
      const address = accounts[0];
      if (!address) throw new Error('Could not get address from wallet.');

      const { message, nonce } = await createChallenge(address, 'ethereum');
      const signature = await signEthMessage({ message });

      await linkAccount('ethereum', address, signature, message, nonce);

    } catch (err: any) {
      setError(err.message || 'An error occurred while linking Ethereum wallet.');
    } finally {
      setIsLoading(null);
    }
  };

  const handleSolanaLink = async () => {
    setIsLoading('solana');
    setError(null);
    try {
      if (!isSolanaConnected) {
        setSolanaModalVisible(true);
        // The rest of the logic will be triggered by the useEffect below once connection is established.
        return;
      }

      if (!solanaPublicKey || !signSolMessage) {
        throw new Error('Solana wallet not ready. Please try again.');
      }
      
      const address = solanaPublicKey.toBase58();
      const { message, nonce } = await createChallenge(address, 'solana');
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await signSolMessage(encodedMessage);
      const signature = Buffer.from(signedMessage).toString('base64');

      await linkAccount('solana', address, signature, message, nonce);

    } catch (err: any) {
      setError(err.message || 'An error occurred while linking Solana wallet.');
    } finally {
      setIsLoading(null);
    }
  };
  
  // Effect to continue Solana linking after wallet is connected via modal
  useEffect(() => {
    if (isSolanaConnected && isLoading === 'solana') {
      handleSolanaLink();
    }
  }, [isSolanaConnected, isLoading]);


  return (
    <div className="mt-6 space-y-4">
      {error && <p className="text-red-500/90 text-sm p-2 bg-red-500/10 rounded-md">{error}</p>}
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground/80">Connect Wallets</h3>
        <Button onClick={handleEthereumLink} disabled={isLoading !== null || isLinked('ethereum')} className="w-full flex justify-center items-center gap-3" variant="outline">
          {isLoading === 'ethereum' ? <Loader2 className="h-5 w-5 animate-spin" /> : <><EthereumIcon /> {isLinked('ethereum') ? 'Ethereum Linked' : 'Link Ethereum Wallet'}</>}
        </Button>
        <Button onClick={handleSolanaLink} disabled={isLoading !== null || isLinked('solana')} className="w-full flex justify-center items-center gap-3" variant="outline">
          {isLoading === 'solana' ? <Loader2 className="h-5 w-5 animate-spin" /> : <><SolanaIcon /> {isLinked('solana') ? 'Solana Linked' : 'Link Solana Wallet'}</>}
        </Button>
      </div>
    </div>
  );
}
