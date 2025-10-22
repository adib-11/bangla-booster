import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware for route protection
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Check if user has a real subdomain (not temp-*)
  const subdomain = token.subdomain as string;
  const hasRealSubdomain = subdomain && !subdomain.startsWith('temp-');
  
  // Protect /admin routes - require real subdomain
  if (request.nextUrl.pathname.startsWith('/admin') && !hasRealSubdomain) {
    return NextResponse.redirect(new URL('/subdomain-setup', request.url));
  }
  
  // Allow access
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
