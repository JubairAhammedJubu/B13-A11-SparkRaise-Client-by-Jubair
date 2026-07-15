import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import PaymentHistoryClient from './PaymentHistoryClient';

export default async function PaymentHistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <PaymentHistoryClient user={session.user} />;
}
