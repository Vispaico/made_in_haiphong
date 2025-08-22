// src/components/dashboard/AccountLinker.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Account } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { useAccount, useSignMessage, useConnect as useWagmiConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useWallet, useSelect as useSolanaSelect } from '@solana/wallet-adapter-react';
import { createChallenge } from '@/lib/auth-utils';

// Icons
const EthereumIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.32l6.18 9.5-6.18 9.5-6.18-9.5L12 2.32zM12 12.5l6.18-3.18-6.18-6-6.18 6L12 12.5z" fill="currentColor"/></svg>;
const SolanaIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.22 12.1a3.25 3.25 0 00-1.04 2.24 3.25 3.25 0 003.25 3.25h1.04a3.25 3.25 0 001.04-2.25 3.25 3.25 0 00-3.25-3.25H4.22zM9.72 11.85a3.25 3.25 0 00-3.25 3.25 3.25 3.25 0 003.25 3.25h1.04a3.25 3.25 0 003.25-3.25 3.25 3.25 0 00-3.25-3.25H9.72zM4.22 6.35a3.25 3.25 0 00-1.04 2.25A3.25 3.25 0 006.43 11.8h1.04a3.25 3.25 0 001.04-2.25A3.25 3.25 0 005.26 6.3H4.22zM18.74 6.1a3.25 3.25 0 001.04-2.24A3.25 3.25 0 0016.53.6h-1.04a3.25 3.25 0 00-1.04 2.25c0 1.24.7 2.25 1.04 2.25h2.21zM13.24 6.35a3.25 3.25 0 003.25-3.25A3.25 3.25 0 0013.24.6h-1.04a3.25 3.25 0 00-3.25 3.25c0 1.24.7 2.25 3.25 2.25h1.04zM18.74 11.85a3.25 3.25 0 001.04-2.25 3.25 3.25 0 00-3.25-3.25h-1.04a3.25 3.25 0 00-1.04 2.25c0 1.24.7 2.25 1.04 2.25h2.21z" fill="currentColor"/></svg>;
const GoogleIcon = () => ( <svg className="h-5 w-5" viewBox="0 0 48 48"> <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.924C34.783 5.344 29.697 3 24 3C12.43 3 3 12.43 3 24s9.43 21 21 21s21-9.43 21-21c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691c-1.645 3.284-2.671 7.031-2.671 11.139C3.635 30.969 4.661 34.716 6.306 37.999L12.55 32.8H6.306z"></path><path fill="#4CAF50" d="M24 45c5.697 0 10.783-2.344 14.802-5.924l-6.25-5.076c-2.119 1.885-4.902 3-7.552 3c-5.223 0-9.651-3.343-11.303-8H6.306c1.645 4.657 6.08 8 11.303 8L24 45z"></path><path fill="#1976D2" d="M43.611 20.083L43.595 20L42 20H24v8h11.303a12.002 12.002 0 0 1-11.303 8l.001-.001l.001.001L24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.924A21.002 21.002 0 0 0 24 3L24 3c-11.57 0-21 9.43-21 21s9.43 21 21 21s21-9.43 21-21c0-1.341-.138-2.65-.389-3.917z"></path> </svg> );

interface AccountLinkerProps {
  accounts: Account[];
}

export default function AccountLinker({ accounts }: AccountLinkerProps) {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState<null | 'ethereum' | 'solana'>(null);
  const [error, setError] = useState<string | null>(null);

  // Web3 Hooks
  const { connectAsync: connectEth } = useWagmiConnect();
  const { signMessageAsync: signEthMessage } = useSignMessage();
  const { connect: connectSol, select: selectSolWallet, wallet: solWallet, signMessage: signSolMessage } = useWallet();

  const isLinked = (provider: string) => accounts.some(acc => acc.provider === provider);

  const handleLink = async (chain: 'ethereum' | 'solana') => {
    setIsLoading(chain);
    setError(null);
    try {
      let address, signature, message, nonce;

      if (chain === 'ethereum') {
        const result = await connectEth({ connector: injected() });
        address = result.accounts[0];
        ({ message, nonce } = await createChallenge(address, chain));
        signature = await signEthMessage({ message });
      } else {
        if (solWallet) await connectSol(); else select('Solflare' as any);
        // A delay to allow wallet connection to establish
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const publicKey = solWallet?.adapter.publicKey;
        if (!publicKey || !signSolMessage) throw new Error('Could not connect to Solana wallet.');
        address = publicKey.toBase58();
        ({ message, nonce } = await createChallenge(address, chain));
        const signedMessage = await signSolMessage(new TextEncoder().encode(message));
        signature = Buffer.from(signedMessage).toString('base64');
      }

      const response = await fetch('/api/auth/link-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature, message, nonce, chain, userId: session?.user?.id }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Failed to link account.');
      }
      
      // Refresh the page to show the new linked account
      router.refresh();

    } catch (err: any) {
      setError(err.message || `An error occurred while linking ${chain} wallet.`);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {error && <p className="text-red-500/90 text-sm p-2 bg-red-500/10 rounded-md">{error}</p>}
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground/80">Connect Wallets</h3>
        <Button onClick={() => handleLink('ethereum')} disabled={isLoading !== null || isLinked('ethereum')} className="w-full flex justify-center items-center gap-3" variant="outline">
          {isLoading === 'ethereum' ? <Loader2 className="h-5 w-5 animate-spin" /> : <><EthereumIcon /> {isLinked('ethereum') ? 'Ethereum Linked' : 'Link Ethereum Wallet'}</>}
        </Button>
        <Button onClick={() => handleLink('solana')} disabled={isLoading !== null || isLinked('solana')} className="w-full flex justify-center items-center gap-3" variant="outline">
          {isLoading === 'solana' ? <Loader2 className="h-5 w-5 animate-spin" /> : <><SolanaIcon /> {isLinked('solana') ? 'Solana Linked' : 'Link Solana Wallet'}</>}
        </Button>
      </div>
    </div>
  );
}
