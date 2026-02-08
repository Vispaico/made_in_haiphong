import { NextRequest, NextResponse } from 'next/server';
import { searchContent } from '@/lib/search/contentSearch';
import prisma from '@/lib/prisma';

type Hit = {
  id: string;
  title: string;
  snippet?: string;
  type: 'listing' | 'article' | 'explore' | 'post' | 'announcement';
  image?: string;
  href: string;
};

async function prismaFallback(q: string, allowedTypes?: string[]): Promise<Hit[]> {
  if (!q.trim()) return [];
  const limit = 5;
  const wants = (allowedTypes?.length ? allowedTypes : ['listing','article','explore','post','announcement']) as Hit['type'][];
  const hits: Hit[] = [];

  if (wants.includes('listing')) {
    const listings = await prisma.listing.findMany({
      where: { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] },
      take: limit,
    });
    hits.push(
      ...listings.map((l) => ({
        id: l.id,
        title: l.title,
        snippet: l.description.slice(0, 140),
        type: 'listing' as const,
        image: l.imageUrls?.[0],
        href: `/marketplace/${l.category ?? 'all'}/${l.id}`,
      }))
    );
  }

  if (wants.includes('article')) {
    const articles = await prisma.article.findMany({
      where: { OR: [{ title: { contains: q, mode: 'insensitive' } }, { content: { contains: q, mode: 'insensitive' } }] },
      take: limit,
    });
    hits.push(
      ...articles.map((a) => ({
        id: a.id,
        title: a.title,
        snippet: a.metaDescription || a.content.slice(0, 140),
        type: 'article' as const,
        href: `/articles/${a.slug}`,
      }))
    );
  }

  if (wants.includes('explore')) {
    const explore = await prisma.exploreEntry.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { body: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: limit,
    });
    hits.push(
      ...explore.map((e) => ({
        id: e.id,
        title: e.title,
        snippet: e.description.slice(0, 140),
        type: 'explore' as const,
        image: e.imageUrls?.[0],
        href: `/explore/${e.category ?? 'all'}/${e.id}`,
      }))
    );
  }

  if (wants.includes('post')) {
    const posts = await prisma.post.findMany({
      where: { content: { contains: q, mode: 'insensitive' } },
      take: limit,
    });
    hits.push(
      ...posts.map((p) => ({
        id: p.id,
        title: p.content.slice(0, 80) || 'Post',
        snippet: p.content.slice(0, 140),
        type: 'post' as const,
        href: `/community/${p.id}`,
      }))
    );
  }

  if (wants.includes('announcement')) {
    const ann = await prisma.announcement.findMany({
      where: { message: { contains: q, mode: 'insensitive' }, isActive: true },
      take: limit,
    });
    hits.push(
      ...ann.map((a) => ({
        id: a.id,
        title: 'Announcement',
        snippet: a.message.slice(0, 140),
        type: 'announcement' as const,
        href: '/',
      }))
    );
  }

  return hits.slice(0, 50);
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  const typeParams = request.nextUrl.searchParams.getAll('type');

  try {
    const ts = await searchContent(q, { type: (typeParams as any) ?? [], perPage: 20 });
    const hits: Hit[] = ((ts as any)?.hits || (ts as any)?.results?.hits || [])
      .map((hit: any) => hit.document || hit)
      .map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        snippet: doc.body?.slice(0, 140),
        type: doc.type as Hit['type'],
        image: doc.image,
        href:
          doc.type === 'listing'
            ? `/marketplace/${doc.category ?? 'all'}/${doc.id}`
            : doc.type === 'article'
              ? `/articles/${doc.slug ?? doc.id}`
              : doc.type === 'explore'
                ? `/explore/${doc.category ?? 'all'}/${doc.id}`
                : doc.type === 'post'
                  ? `/community/${doc.id}`
                  : '/',
      }));

    return NextResponse.json({ hits, source: 'typesense' });
  } catch (error) {
    console.warn('Search error, falling back to Prisma search', error);
    const hits = await prismaFallback(q, typeParams);
    return NextResponse.json({ hits, source: 'prisma-fallback' });
  }
}
