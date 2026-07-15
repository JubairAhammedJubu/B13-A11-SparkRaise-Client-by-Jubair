import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Role-Based Authorization middleware (doc requirement, "Challenges" section).
// Runs server-side on every private route, reading the session cookie directly —
// this is why reloading a private route never bounces the user back to /auth/signin;
// there's no client-side token check involved in the decision.
export async function proxy(request) {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    const { pathname } = request.nextUrl;

    // If not logged in, redirect to signin
    if (!session) {
        const signinUrl = new URL('/auth/signin', request.url);
        signinUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signinUrl);
    }

    const role = session.user?.role;

    // Role-based protection
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/dashboard/creator') && role !== 'creator') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/dashboard/supporter') && role !== 'supporter') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
}
