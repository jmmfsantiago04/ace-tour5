import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Skip middleware for API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    return null;
  }

  const token = await getToken({ req });
  const isAuth = !!token;
  const pathname = req.nextUrl.pathname;
  const isAuthPage = pathname === '/admin/login';
  const isAdminRoot = pathname === '/admin';

  // If trying to access /admin directly, redirect to login first
  if (isAdminRoot && !isAuth) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // If on login page and already authenticated, redirect to admin
  if (isAuthPage && isAuth && token.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // If not authenticated and trying to access any admin route (except login), redirect to login
  if (!isAuth && !isAuthPage) {
    let from = pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/admin/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  // If authenticated but not an admin, redirect to home
  if (isAuth && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Allow access to login page when not authenticated
  if (isAuthPage && !isAuth) {
    return null;
  }

  // Allow access to admin routes when authenticated as admin
  if (isAuth && token.role === 'ADMIN') {
    return null;
  }

  // Default: redirect to login
  return NextResponse.redirect(new URL('/admin/login', req.url));
}

export const config = {
  matcher: [
    // Match admin routes
    '/admin',
    '/admin/:path*',
    // Match API routes
    '/api/:path*'
  ]
}; 