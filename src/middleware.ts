import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const token = request.cookies.get('si3-jwt')?.value;
  const pathname = request.nextUrl.pathname;

  console.log('[Middleware] Processing request:', {
    pathname,
    hasToken: !!token,
    tokenLength: token?.length || 0,
    userAgent: request.headers.get('user-agent')?.substring(0, 50) || 'unknown'
  });

  if (pathname === '/login') {
    // Prevent caching of the login page (avoid serving RSC flight as text)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  const protectedRoutes = ['/home', '/profile', '/settings', '/admin', '/publisher'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    console.log('[Middleware] Protected route accessed without token, redirecting to login:', {
      pathname,
      isProtectedRoute,
      hasToken: !!token
    });
    const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
    redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    redirectResponse.headers.set('Pragma', 'no-cache');
    redirectResponse.headers.set('Expires', '0');
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - fonts folder
     * - .well-known folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|fonts/|\\.well-known/).*)',
  ],
};
