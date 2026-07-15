import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import ReportsClient from './ReportsClient';

export default async function AdminReportsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <ReportsClient user={session.user} />;
}
