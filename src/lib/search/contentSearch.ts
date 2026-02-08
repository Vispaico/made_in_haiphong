'use server';

import { getCollectionName, getTypesenseClient } from './typesenseClient';

export type SearchDocument = {
  id: string;
  title: string;
  body?: string;
  type: 'listing' | 'article' | 'explore' | 'post' | 'announcement';
  category?: string;
  tags?: string[];
  slug?: string;
  image?: string;
  createdAt?: number;
  popularity?: number;
};

const collectionName = getCollectionName('content');

const schema = {
  name: collectionName,
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title', type: 'string' },
    { name: 'body', type: 'string', optional: true },
    { name: 'type', type: 'string', facet: true },
    { name: 'category', type: 'string', facet: true, optional: true },
    { name: 'tags', type: 'string[]', facet: true, optional: true },
    { name: 'slug', type: 'string', optional: true },
    { name: 'image', type: 'string', optional: true },
    { name: 'createdAt', type: 'int64', optional: true },
    { name: 'popularity', type: 'int64', optional: true },
  ],
  default_sorting_field: 'popularity',
};

async function ensureCollection() {
  const client = getTypesenseClient();
  try {
    await client.collections(collectionName).retrieve();
  } catch (error: any) {
    if (error?.httpStatus === 404) {
      await client.collections().create(schema as any);
    } else {
      throw error;
    }
  }
}

export async function upsertDocuments(documents: SearchDocument[]) {
  if (!documents.length) return { success: true };
  const client = getTypesenseClient();
  await ensureCollection();
  const payload = documents.map((doc) => ({
    ...doc,
    createdAt: doc.createdAt ?? Date.now(),
    popularity: doc.popularity ?? 0,
  }));

  const importResults = await client
    .collections(collectionName)
    .documents()
    .import(payload, { action: 'upsert' });

  return importResults;
}

export async function searchContent(query: string, options?: { type?: SearchDocument['type'][]; perPage?: number }) {
  if (!query.trim()) return { hits: [] };
  const client = getTypesenseClient();
  await ensureCollection();
  const filterBy = options?.type?.length ? `type:=[${options.type.join(',')}]` : undefined;

  const results = await client.collections(collectionName).documents().search({
    q: query,
    query_by: 'title,body,tags',
    per_page: options?.perPage ?? 20,
    filter_by: filterBy,
  });

  return results;
}

export async function deleteDocument(id: string) {
  const client = getTypesenseClient();
  await ensureCollection();
  await client.collections(collectionName).documents(id).delete();
}
