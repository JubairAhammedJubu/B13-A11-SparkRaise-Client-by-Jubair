import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import CreatorProfile from './CreatorProfile';

export default async function CreatorProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return <CreatorProfile user={session.user} />;
}
