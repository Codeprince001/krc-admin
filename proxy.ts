import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "admin_access_token";
const ALLOWED_ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

/**
 * Decode JWT payload without verification (for role check only).
 * Backend still verifies the token on every API call.
 * Returns null if token is invalid or malformed.
 */
function decodeJwtPayload(token: string): { role?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    return JSON.parse(decoded) as { role?: string; exp?: number };
  } catch {
    return null;
  }
}

/**
 * Server-side route protection for the admin panel.
 * - Protects all dashboard routes (everything except /login and static assets).
 * - Requires admin_access_token cookie (set by API client on login).
 * - Optionally validates that JWT payload role is ADMIN or SUPER_ADMIN
 *   so that members cannot see dashboard UI even with a valid token.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and auth routes
  if (pathname === "/login" || pathname.startsWith("/login/")) {
    return NextResponse.next();
  }

  // Allow Next.js internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") // favicon, images, etc.
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeJwtPayload(token);
  if (payload?.role && !ALLOWED_ADMIN_ROLES.includes(payload.role)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("unauthorized", "1");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
