import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import SupporterProfile from './SupporterProfile';

export default async function SupporterProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return <SupporterProfile user={session.user} />;
}
