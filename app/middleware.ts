// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // 1. Define Route Types
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isDashboardPage = pathname.startsWith('/dashboard');

  // DEBUG: Check your terminal to see if this triggers
  // console.log(`Checking route: ${pathname} | Session: ${!!session}`);

  // 2. BOUNCE LOGIC: Logged in users should NOT see Login/Signup
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. GUARD LOGIC: Logged out users should NOT see Dashboard
  if (isDashboardPage && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 4. THE MATCHER: Must be broad enough to catch auth pages
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. Static files (svg, png, jpg, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};