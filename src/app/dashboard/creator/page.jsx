import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import CreatorDashboardClient from './CreatorDashboardClient';

export default async function CreatorDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return <CreatorDashboardClient user={session.user} />;
}
