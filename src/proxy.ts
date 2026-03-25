import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Normalize certain paths to lowercase to handle case-insensitive requests
  const normalizationPaths = ['/courses', '/expeditions', '/faq', '/admin', '/moderator', '/profile', '/dashboard'];
  const lower = pathname.toLowerCase();
  if (pathname !== lower) {
    const shouldNormalize = normalizationPaths.some(p => lower.startsWith(p));
    if (shouldNormalize) {
      const dest = new URL(lower, request.url);
      return NextResponse.redirect(dest);
    }
  }
  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/dashboard', '/admin', '/moderator'];
  
  // Admin-only routes
  const adminRoutes = ['/admin'];
  
  // Moderator-only routes
  const moderatorRoutes = ['/moderator'];

  // Check if current path needs protection
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdmin = adminRoutes.some(route => pathname.startsWith(route));
  const isModerator = moderatorRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    // Allow SUPER_ADMIN to access admin routes as well
    if (isAdmin && !['ADMIN', 'SUPER_ADMIN'].includes((token as any).role)) {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

    if (isModerator && !['ADMIN', 'MODERATOR'].includes((token as any).role)) {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

    // Check if account is locked
    if ((token as any).isLocked) {
      return NextResponse.redirect(new URL('/account-locked', request.url));
    }

    // Check if account is active
    if (!(token as any).isActive) {
      return NextResponse.redirect(new URL('/account-deactivated', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/dashboard/:path*', '/admin/:path*', '/moderator/:path*']
};
