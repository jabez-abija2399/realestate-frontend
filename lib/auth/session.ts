import { jwtDecode } from 'jwt-decode';

/**
 * session.ts — JWT session helpers.
 *
 * Two contexts:
 *  - Server (middleware, Server Components): read cookie from request headers.
 *  - Client (browser): read the cookie value from document.cookie.
 *
 * The JWT payload shape is intentionally minimal. The backend must include
 * at least { sub, role, exp } in the token.
 */

export type UserRole = 'buyer' | 'owner' | 'admin';

export interface JwtPayload {
  sub: string;           // user ID
  role: UserRole;
  name?: string;
  email?: string;
  walletAddress?: string;
  exp: number;           // Unix timestamp
  iat: number;
}

export interface Session {
  token: string;
  user: JwtPayload;
}

const COOKIE_NAME = 'auth_token';

// ─── Token decode ────────────────────────────────────────────────────────────

function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    // Reject expired tokens immediately
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── Client-side (browser) ───────────────────────────────────────────────────

/**
 * getClientSession — reads the JWT cookie in the browser.
 * Safe to call from any client component or Axios interceptor.
 * Returns null if there is no valid, unexpired token.
 */
export function getClientSession(): Session | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));

  const token = match?.split('=')[1];
  if (!token) return null;

  const user = decodeToken(token);
  if (!user) return null;

  return { token, user };
}

// ─── Server-side (middleware / Server Components) ────────────────────────────

/**
 * getServerSession — extracts the JWT from a raw Cookie header string.
 * Used in middleware.ts where we receive the header as a plain string.
 *
 * Usage (middleware):
 *   const token = request.cookies.get('auth_token')?.value
 *   const session = token ? getSessionFromToken(token) : null
 */
export function getSessionFromToken(token: string): Session | null {
  const user = decodeToken(token);
  if (!user) return null;
  return { token, user };
}

/**
 * Cookie name constant — import this wherever you need to set/clear the cookie
 * (e.g. in the login/logout Server Actions or Route Handlers).
 */
export { COOKIE_NAME as AUTH_COOKIE_NAME };
