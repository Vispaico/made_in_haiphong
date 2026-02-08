'use server';

import Typesense, { type Client } from 'typesense';
import { serverEnv } from '@/env/server';

let cachedClient: Client | null = null;

export function getTypesenseClient() {
  if (cachedClient) return cachedClient;

  const apiKey = serverEnv.TYPESENSE_API_KEY;
  const host = serverEnv.TYPESENSE_HOST;
  const port = Number(serverEnv.TYPESENSE_PORT ?? '8108');
  const protocol = serverEnv.TYPESENSE_PROTOCOL ?? 'http';

  if (!apiKey || !host) {
    throw new Error('Typesense is not configured. Set TYPESENSE_API_KEY and TYPESENSE_HOST.');
  }

  cachedClient = new Typesense.Client({
    apiKey,
    nodes: [{ host, port, protocol }],
    connectionTimeoutSeconds: 5,
  });

  return cachedClient;
}

export function getCollectionName(name: string) {
  const prefix = serverEnv.TYPESENSE_COLLECTION_PREFIX ?? 'mih_';
  return `${prefix}${name}`;
}
