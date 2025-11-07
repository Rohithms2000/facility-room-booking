// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // Or however you store auth
  const userRole = request.cookies.get('role')?.value; // e.g., 'admin' or 'user'

  // Restrict access to /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || userRole !== 'admin') {
      // Redirect to login or "Not Authorized" page
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

// Match paths to apply the middleware
export const config = {
  matcher: ['/admin/:path*'],
};
