import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const token = request.cookies.get('si3-jwt')?.value;

  if (request.nextUrl.pathname === '/login') {
    return response;
  }

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
