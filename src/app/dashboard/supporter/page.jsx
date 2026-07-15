import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import SupporterDashboardClient from './SupporterDashboardClient';

export default async function SupporterDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <SupporterDashboardClient user={session.user} />;
}
