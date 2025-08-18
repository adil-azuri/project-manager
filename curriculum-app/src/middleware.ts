// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Utility function untuk decode JWT
function decodeJWT(token: string) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64').toString();
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  const protectRoute = ['/dashboard', '/profile'];

  const adminOnlyRoute = ['/add-project'];

  if (protectRoute.includes(request.nextUrl.pathname) && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (adminOnlyRoute.includes(request.nextUrl.pathname)) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const decoded = decodeJWT(token.value);
    if (!decoded || decoded.role !== 'ADMIN') {
      const unauthorizedUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/add-project/:path*'],
};
