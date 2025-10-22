import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware for route protection
export function middleware(request: NextRequest) {
  // TODO: Implement auth checks for protected routes
  // For now, just pass through
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/owner/:path*',
    '/api/products/:path*',
  ],
};
