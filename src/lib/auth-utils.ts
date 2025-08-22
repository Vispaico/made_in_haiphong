// lib/auth-utils.ts
import { SiweMessage } from 'siwe';
import { getCsrfToken } from 'next-auth/react';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { Buffer } from 'buffer';

// This function is called from the frontend to get a message to sign
export const createChallenge = async (address: string, chain: 'ethereum' | 'solana') => {
  const nonce = await getCsrfToken();
  if (!nonce) {
    throw new Error('Could not get a nonce.');
  }

  let message: string;
  if (chain === 'ethereum') {
    const siweMessage = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in to Made in Haiphong',
      uri: window.location.origin,
      version: '1',
      chainId: 1, // Mainnet, can be adjusted
      nonce,
    });
    message = siweMessage.prepareMessage();
  } else {
    // Solana message format
    message = `Sign in to Made in Haiphong. Nonce: ${nonce}`;
  }
  return { message, nonce };
};

// --- Ethereum Signature Verification ---
export const verifyEthereumSignature = async (message: string, signature: string, nonce: string): Promise<boolean> => {
  try {
    const siweMessage = new SiweMessage(message);
    const result = await siweMessage.verify({ signature, nonce });
    return result.success;
  } catch (error) {
    console.error('Ethereum signature verification failed:', error);
    return false;
  }
};

// --- Solana Signature Verification ---
export const verifySolanaSignature = (message: string, signature: string, address: string): boolean => {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Buffer.from(signature, 'hex');
    const publicKey = new PublicKey(address).toBytes();
    
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKey);
  } catch (error) {
    console.error('Solana signature verification failed:', error);
    return false;
  }
};
