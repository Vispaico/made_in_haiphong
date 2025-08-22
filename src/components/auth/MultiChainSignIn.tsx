// src/components/auth/MultiChainSignIn.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useAccount, useSignMessage, useConnect as useWagmiConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/Button';
import { createChallenge } from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Custom Wallet Icon components for styling
const EthereumIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.32l6.18 9.5-6.18 9.5-6.18-9.5L12 2.32zM12 12.5l6.18-3.18-6.18-6-6.18 6L12 12.5z" fill="currentColor"/></svg>;
const SolanaIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.22 12.1a3.25 3.25 0 00-1.04 2.24 3.25 3.25 0 003.25 3.25h1.04a3.25 3.25 0 001.04-2.25 3.25 3.25 0 00-3.25-3.25H4.22zM9.72 11.85a3.25 3.25 0 00-3.25 3.25 3.25 3.25 0 003.25 3.25h1.04a3.25 3.25 0 003.25-3.25 3.25 3.25 0 00-3.25-3.25H9.72zM4.22 6.35a3.25 3.25 0 00-1.04 2.25A3.25 3.25 0 006.43 11.8h1.04a3.25 3.25 0 001.04-2.25A3.25 3.25 0 005.26 6.3H4.22zM18.74 6.1a3.25 3.25 0 001.04-2.24A3.25 3.25 0 0016.53.6h-1.04a3.25 3.25 0 00-1.04 2.25c0 1.24.7 2.25 1.04 2.25h2.21zM13.24 6.35a3.25 3.25 0 003.25-3.25A3.25 3.25 0 0013.24.6h-1.04a3.25 3.25 0 00-3.25 3.25c0 1.24.7 2.25 3.25 2.25h1.04zM18.74 11.85a3.25 3.25 0 001.04-2.25 3.25 3.25 0 00-3.25-3.25h-1.04a3.25 3.25 0 00-1.04 2.25c0 1.24.7 2.25 1.04 2.25h2.21z" fill="currentColor"/></svg>;


export function MultiChainSignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<null | 'ethereum' | 'solana'>(null);
  const [error, setError] = useState<string | null>(null);

  // === Ethereum Hooks ===
  const { address: ethAddress, isConnected: isEthConnected } = useAccount();
  const { connectAsync: connectEth } = useWagmiConnect();
  const { signMessageAsync: signEthMessage } = useSignMessage();

  // === Solana Hooks ===
  const { publicKey: solPublicKey, connected: isSolConnected, signMessage: signSolMessage, connect: connectSol, select: selectSolWallet, wallet: solWallet } = useWallet();

  const handleEthereumSignIn = async () => {
    setIsLoading('ethereum');
    setError(null);
    try {
      let address = ethAddress;
      if (!isEthConnected) {
        const { account } = await connectEth({ connector: injected() });
        address = account;
      }
      if (!address) throw new Error('Could not connect to Ethereum wallet.');

      const { message, nonce } = await createChallenge(address, 'ethereum');
      const signature = await signEthMessage({ message });
      
      const result = await signIn('web3', { redirect: false, message, signature, address, chain: 'ethereum', nonce });
      if (result?.error) throw new Error(result.error);
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred with Ethereum sign-in.');
    } finally {
      setIsLoading(null);
    }
  };

  const handleSolanaSignIn = async () => {
    setIsLoading('solana');
    setError(null);
    try {
      let publicKey = solPublicKey;
      if (!isSolConnected) {
        // This is a simplified flow. A better UX would involve a modal to select a wallet if multiple are installed.
        if (solWallet) {
          await connectSol();
          publicKey = solWallet.adapter.publicKey;
        } else {
          // A bit of a hack to trigger the wallet selection modal if no wallet is pre-selected
          selectSolWallet('Solflare' as any); 
          throw new Error('Please select a Solana wallet and try again.');
        }
      }
      if (!publicKey || !signSolMessage) throw new Error('Could not connect to Solana wallet.');
      const address = publicKey.toBase58();

      const { message, nonce } = await createChallenge(address, 'solana');
      const signedMessage = await signSolMessage(new TextEncoder().encode(message));
      const signature = Buffer.from(signedMessage).toString('base64');

      const result = await signIn('web3', { redirect: false, message, signature, address, chain: 'solana', nonce });
      if (result?.error) throw new Error(result.error);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred with Solana sign-in.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500/90 text-sm text-center p-2 bg-red-500/10 rounded-md">{error}</p>}
      
      <Button
        onClick={handleEthereumSignIn}
        disabled={isLoading !== null}
        className="w-full flex items-center justify-center gap-3"
        variant="outline"
      >
        {isLoading === 'ethereum' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <EthereumIcon />
            <span>Sign in with Ethereum</span>
          </>
        )}
      </Button>

      <Button
        onClick={handleSolanaSignIn}
        disabled={isLoading !== null}
        className="w-full flex items-center justify-center gap-3"
        variant="outline"
      >
        {isLoading === 'solana' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <SolanaIcon />
            <span>Sign in with Solana</span>
          </>
        )}
      </Button>
    </div>
  );
}
