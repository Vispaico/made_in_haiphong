// src/components/dashboard/AccountLinker.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Account } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { Loader2, XCircle } from 'lucide-react';
import { useConnect as useWagmiConnect, useSignMessage } from 'wagmi';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { createChallenge } from '@/lib/auth-utils';

// Icons
const EthereumIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.32l6.18 9.5-6.18 9.5-6.18-9.5L12 2.32zM12 12.5l6.18-3.18-6.18-6-6.18 6L12 12.5z" fill="currentColor"/></svg>;
const SolanaIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.22 12.1a3.25 3.25 0 00-1.04 2.24 3.25 3.25 0 003.25 3.25h1.04a3.25 3.25 0 001.04-2.25 3.25 3.25 0 00-3.25-3.25H4.22zM9.72 11.85a3.25 3.25 0 00-3.25 3.25 3.25 3.25 0 003.25 3.25h1.04a3.25 3.25 0 003.25-3.25 3.25 3.25 0 00-3.25-3.25H9.72zM4.22 6.35a3.25 3.25 0 00-1.04 2.25A3.25 3.25 0 006.43 11.8h1.04a3.25 3.25 0 001.04-2.25A3.25 3.25 0 005.26 6.3H4.22zM18.74 6.1a3.25 3.25 0 001.04-2.24A3.25 3.25 0 0016.53.6h-1.04a3.25 3.25 0 00-1.04 2.25c0 1.24.7 2.25 1.04 2.25h2.21zM13.24 6.35a3.25 3.25 0 003.25-3.25A3.25 3.25 0 0013.24.6h-1.04a3.25 3.25 0 00-3.25 3.25c0 1.24.7 2.25 3.25 2.25h1.04zM18.74 11.85a3.25 3.25 0 001.04-2.25 3.25 3.25 0 00-3.25-3.25h-1.04a3.25 3.25 0 00-1.04 2.25c0 1.24.7 2.25 1.04 2.25h2.21z" fill="currentColor"/></svg>;

interface AccountLinkerProps {
  accounts: Account[];
}

export default function AccountLinker({ accounts }: AccountLinkerProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<null | 'ethereum' | 'solana' | 'unlink-ethereum' | 'unlink-solana'>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Ethereum Hooks ---
  const { connectors, connectAsync } = useWagmiConnect();
  const { signMessageAsync: signEthMessage } = useSignMessage();
  
  // --- Solana Hooks ---
  const { publicKey: solanaPublicKey, signMessage: signSolMessage, connected: isSolanaConnected } = useWallet();
  const { setVisible: setSolanaModalVisible, visible: isSolanaModalVisible } = useWalletModal();

  const isLinked = (provider: string) => accounts.some(acc => acc.provider === provider);

  const linkAccountAPI = async (chain: 'ethereum' | 'solana', address: string, signature: string, message: string, nonce: string) => {
    const response = await fetch('/api/auth/link-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature, message, nonce, chain, userId: session?.user?.id }),
    });
    if (!response.ok) throw new Error(await response.text() || 'Failed to link account.');
    router.refresh();
  };

  const handleUnlink = async (provider: 'ethereum' | 'solana') => {
    setIsLoading(`unlink-${provider}`);
    setError(null);
    try {
      const response = await fetch('/api/auth/unlink-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      if (!response.ok) throw new Error(await response.text() || `Failed to unlink ${provider} account.`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(null);
    }
  };

  const handleEthereumLink = async () => {
    setIsLoading('ethereum');
    setError(null);
    try {
      const injectedConnector = connectors.find(c => c.id === 'injected' || c.name === 'MetaMask');
      if (!injectedConnector) throw new Error('Ethereum provider not found. Please install a wallet extension like MetaMask.');
      
      const { accounts } = await connectAsync({ connector: injectedConnector });
      const address = accounts[0];
      if (!address) throw new Error('Could not get address from wallet.');

      const { message, nonce } = await createChallenge(address, 'ethereum');
      const signature = await signEthMessage({ message });
      await linkAccountAPI('ethereum', address, signature, message, nonce);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(null);
    }
  };

  const handleSolanaLink = () => {
    setError(null);
    setIsLoading('solana');
    setSolanaModalVisible(true);
  };
  
  useEffect(() => {
    const signAndLinkSolana = async () => {
      if (!solanaPublicKey || !signSolMessage) {
        setError('Solana wallet not ready. Please try connecting again.');
        setIsLoading(null);
        return;
      }
      try {
        const address = solanaPublicKey.toBase58();
        const { message, nonce } = await createChallenge(address, 'solana');
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await signSolMessage(encodedMessage);
        const signature = Buffer.from(signedMessage).toString('base64');
        await linkAccountAPI('solana', address, signature, message, nonce);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(null);
        setSolanaModalVisible(false);
      }
    };

    if (isLoading === 'solana' && isSolanaConnected && solanaPublicKey && signSolMessage) {
      signAndLinkSolana();
    }
  }, [isLoading, isSolanaConnected, solanaPublicKey, signSolMessage]);

  useEffect(() => {
    if (isLoading === 'solana' && !isSolanaModalVisible && !isSolanaConnected) {
      setIsLoading(null);
    }
  }, [isLoading, isSolanaModalVisible, isSolanaConnected]);

  return (
    <div className="mt-6 space-y-4">
      {error && <p className="text-red-500/90 text-sm p-2 bg-red-500/10 rounded-md">{error}</p>}
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground/80">Connect Wallets</h3>
        
        {isLinked('ethereum') ? (
          <div className="flex items-center justify-between rounded-md border border-secondary p-3">
            <div className="flex items-center gap-3 font-medium"><EthereumIcon /> Ethereum Linked</div>
            <Button onClick={() => handleUnlink('ethereum')} variant="ghost" size="sm" disabled={isLoading !== null}>
              {isLoading === 'unlink-ethereum' ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 text-red-500" />}
            </Button>
          </div>
        ) : (
          <Button onClick={handleEthereumLink} disabled={isLoading !== null} className="w-full flex justify-center items-center gap-3" variant="outline">
            {isLoading === 'ethereum' ? <Loader2 className="h-5 w-5 animate-spin" /> : <><EthereumIcon /> Link Ethereum Wallet</>}
          </Button>
        )}

        {isLinked('solana') ? (
          <div className="flex items-center justify-between rounded-md border border-secondary p-3">
            <div className="flex items-center gap-3 font-medium"><SolanaIcon /> Solana Linked</div>
            <Button onClick={() => handleUnlink('solana')} variant="ghost" size="sm" disabled={isLoading !== null}>
              {isLoading === 'unlink-solana' ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 text-red-500" />}
            </Button>
          </div>
        ) : (
          <Button onClick={handleSolanaLink} disabled={isLoading !== null} className="w-full flex justify-center items-center gap-3" variant="outline">
            {isLoading === 'solana' ? <Loader2 className="h-5 w-5 animate-spin" /> : <><SolanaIcon /> Link Solana Wallet</>}
          </Button>
        )}
      </div>
    </div>
  );
}
