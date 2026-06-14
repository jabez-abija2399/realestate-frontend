import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromToken } from '@/lib/auth/session';
import { canAccessRoute } from '@/config/permissions.config';
import type { UserRole } from '@/types';

/**
 * proxy.ts — route protection for the (dashboard) group.
 *
 * Next.js 16: middleware.ts is deprecated; this file is named proxy.ts
 * and exports a function named `proxy`. The runtime is Node.js (not Edge).
 *
 * Flow for every /dashboard/** request:
 *  1. Read the JWT from the auth_token cookie on the request object.
 *  2. Decode and validate the token (expiry check inside getSessionFromToken).
 *  3. If no valid session → redirect to /login with ?from= for post-login redirect.
 *  4. If valid session but role not permitted for the path → redirect to /unauthorized.
 *  5. Otherwise → attach x-user-id and x-user-role headers so Server Components
 *     can read the decoded identity without re-parsing the JWT.
 */

const AUTH_COOKIE = 'auth_token';

// ─── Public routes — always pass through ─────────────────────────────────────
const PUBLIC_PREFIXES = [
  '/',
  '/about',
  '/contact',
  '/listings',
  '/login',
  '/register',
  '/unauthorized',
  '/api',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

// ─── Proxy function ────────────────────────────────────────────────────────

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and Next.js internals — skip entirely
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.\w+$/) // files with extension (images, fonts, etc.)
  ) {
    return NextResponse.next();
  }

  // Public paths don't need auth
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // ── Dashboard routes require authentication ─────────────────────────────
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    // No token — redirect to login and remember the original destination
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = getSessionFromToken(token);

  if (!session) {
    // Token present but invalid or expired — clear cookie and redirect
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_COOKIE);
    return response;
  }

  const { role } = session.user;

  // ── Role-based route access ─────────────────────────────────────────────
  if (!canAccessRoute(role as UserRole, pathname)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // ── Pass decoded identity downstream via request headers ────────────────
  // Server Components read these with `headers()` — no JWT re-parse needed.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', session.user.sub);
  requestHeaders.set('x-user-role', role);
  requestHeaders.set('x-user-name', session.user.name ?? '');

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

// ─── Matcher ────────────────────────────────────────────────────────────────
// Run the proxy on all paths except static files and Next.js internals.
// Even though isPublicPath() handles early returns above, limiting the
// matcher reduces unnecessary invocations on every static asset request.

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
