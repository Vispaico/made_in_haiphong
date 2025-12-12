// src/providers/AppProviders.tsx
'use client';

import React, { useMemo } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia, polygon } from 'wagmi/chains';
import { walletConnect, injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

const queryClient = new QueryClient();

// IMPORTANT: You will need to get a project ID from WalletConnect Cloud (https://cloud.walletconnect.com)
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';
if (!walletConnectProjectId) {
  console.warn('Warning: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect will not work.');
}

// Wagmi (Ethereum) configuration
const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, polygon],
  connectors: [
    injected(),
    walletConnect({ projectId: walletConnectProjectId, metadata: { name: 'Made in Haiphong', description: 'Haiphong in Your Pocket', url: 'https://www.made-in-haiphong.com', icons: [] } }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Solana wallet configuration
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  // Instantiate Solana wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    [network]
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
