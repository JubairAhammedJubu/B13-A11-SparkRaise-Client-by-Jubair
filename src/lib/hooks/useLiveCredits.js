'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

// ---------------------------------------------------------------------------
// Why this exists:
//
// Better Auth's client session (`useSession()` / `authClient.getSession()`)
// is cached (see `session.cookieCache` in src/lib/auth.js, maxAge 30 days).
// That cached session embeds the `credits` / `raised_credits` fields that
// were true *at login time*.
//
// The Express server updates those fields directly in MongoDB's `user`
// collection whenever credits change (a purchase, a contribution, an
// approval, a withdrawal) — completely bypassing Better Auth. So the cached
// session never finds out, and components reading `session.user.credits`
// keep showing a stale number (e.g. "45 credits") even though the database,
// and any component that hits the Express API directly, correctly shows the
// live number (e.g. "645 credits").
//
// The fix: never trust `session.user.credits` for display. Always read the
// live value from `/api/users/me` (a direct DB read), and re-fetch it
// whenever the route changes or a mutation elsewhere calls
// `broadcastCreditsRefresh()`.
// ---------------------------------------------------------------------------

export function broadcastCreditsRefresh() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('ghurni:credits-refresh'));
    }
}

export function useLiveCredits(user) {
    const [credits, setCredits] = useState(user?.credits ?? 0);
    const [raisedCredits, setRaisedCredits] = useState(user?.raised_credits ?? 0);
    const pathname = usePathname();

    const refresh = useCallback(async () => {
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
                headers: { authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;

            const data = await res.json();
            setCredits(data?.credits ?? 0);
            setRaisedCredits(data?.raised_credits ?? 0);
        } catch {
            // Network hiccup — keep showing the last known value rather than 0.
        }
    }, []);

    // Re-fetch on login state change and on every route change (covers the
    // Stripe redirect back to the dashboard after a purchase).
    useEffect(() => {
        if (user) refresh();
    }, [user, pathname, refresh]);

    // Re-fetch on demand from anywhere (contribute, withdraw, purchase, etc.)
    useEffect(() => {
        window.addEventListener('ghurni:credits-refresh', refresh);
        return () => window.removeEventListener('ghurni:credits-refresh', refresh);
    }, [refresh]);

    return { credits, raisedCredits, refresh };
}
