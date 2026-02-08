import { NextResponse, type NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 40;
const rateLimitBuckets = new Map<string, number[]>();

const RATE_LIMITED_PREFIXES = [
  '/api/auth',
  '/api/register',
  '/api/temp-reset-password',
  '/api/upload',
  '/api/chat',
  '/api/contact',
  '/api/assistant',
  '/api/search',
];

function isRateLimited(pathname: string) {
  return RATE_LIMITED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function applyRateLimit(request: NextRequest) {
  const ip =
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = (rateLimitBuckets.get(key) || []).filter((ts) => ts > windowStart);

  if (hits.length >= RATE_LIMIT_MAX_REQUESTS) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  hits.push(now);
  rateLimitBuckets.set(key, hits);
  return null;
}

function enforceApiCsrf(request: NextRequest) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return null;
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } catch (_err) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    const csrfBlocked = enforceApiCsrf(request);
    if (csrfBlocked) return csrfBlocked;

    if (isRateLimited(pathname)) {
      const limited = applyRateLimit(request);
      if (limited) return limited;
    }
  }

  const response = NextResponse.next();
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
