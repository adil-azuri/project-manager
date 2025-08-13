import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function authenticate(request: NextRequest) {
    const protectedRoutes = ['/dashboard', '/profile',]
    const pathname = request.nextUrl.pathname

    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    if (isProtectedRoute) {
        const token = request.cookies.get('token')

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
