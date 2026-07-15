'use client';

import { useEffect } from 'react';
import { useSession, syncAccessToken, clearAccessToken } from '@/lib/auth-client';

// Doc requirement: after login/registration, store a secret access-token for the
// user in browser local storage. This runs on every page (mounted in the root
// layout) so it covers email/password login, registration, and the Google OAuth
// redirect flow uniformly, without duplicating logic in every auth form.
export default function TokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      syncAccessToken();
    } else {
      clearAccessToken();
    }
  }, [session?.user]);

  return null;
}
