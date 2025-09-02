import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get the JWT token from cookies
  const token = request.cookies.get('si3-jwt')?.value;

  console.log('[Next.js Middleware] Processing request:', {
    pathname: request.nextUrl.pathname,
    hasToken: !!token,
    tokenLength: token?.length,
    cookies: request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
  });

  // Note: We don't need to add Authorization header for /api/ routes
  // because those are Next.js API routes, not backend API calls
  // The backend API calls are made directly to localhost:8080 and will include cookies automatically

  // For authentication routes, handle redirects
  if (request.nextUrl.pathname === '/login') {
    if (token) {
      console.log('[Middleware] User has token, redirecting from login to dashboard');
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  // For protected routes, check authentication
  const protectedRoutes = ['/home', '/profile', '/settings', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    console.log('[Middleware] Protected route accessed without token, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
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
