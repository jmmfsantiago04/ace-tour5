import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Skip middleware for non-admin API routes
  if (req.nextUrl.pathname.includes('/api/checkout')) {
    return null;
  }

  // Skip middleware for API routes that don't start with /api/admin
  if (req.nextUrl.pathname.startsWith('/api') && !req.nextUrl.pathname.startsWith('/api/admin')) {
    return null;
  }

  const token = await getToken({ 
    req,
    cookieName: 'next-auth.session-token'
  });
  
  const isAuth = !!token;
  const pathname = req.nextUrl.pathname;
  const isAuthPage = pathname === '/admin/login';
  const isAdminRoot = pathname === '/admin';
  const isDashboard = pathname === '/admin/dashboard';

  // Helper function for redirects
  const redirectTo = (path: string) => {
    const url = new URL(path, req.url);
    return NextResponse.redirect(url, { status: 302 });
  };

  // If trying to access dashboard and not authenticated, redirect to login
  if (isDashboard && !isAuth) {
    return redirectTo('/admin/login');
  }

  // If trying to access dashboard without admin role, redirect to home
  if (isDashboard && (!isAuth || token?.role !== 'ADMIN')) {
    return redirectTo('/');
  }

  // If trying to access /admin directly, redirect to login first
  if (isAdminRoot && !isAuth) {
    return redirectTo('/admin/login');
  }

  // If on login page and already authenticated, redirect to dashboard
  if (isAuthPage && isAuth && token.role === 'ADMIN') {
    return redirectTo('/admin/dashboard');
  }

  // If not authenticated and trying to access any admin route (except login), redirect to login
  if (!isAuth && !isAuthPage) {
    let from = pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return redirectTo(`/admin/login?from=${encodeURIComponent(from)}`);
  }

  // If authenticated but not an admin, redirect to home
  if (isAuth && token.role !== 'ADMIN') {
    return redirectTo('/');
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
  return redirectTo('/admin/login');
}

export const config = {
  matcher: [
    // Match admin routes
    '/admin',
    '/admin/:path*',
    // Match admin API routes only
    '/api/admin/:path*'
  ]
}; 