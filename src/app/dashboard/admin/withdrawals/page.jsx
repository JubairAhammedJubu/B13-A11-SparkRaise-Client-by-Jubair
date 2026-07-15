import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import WithdrawalsAdminClient from './WithdrawalsAdminClient';

export default async function AdminWithdrawalsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <WithdrawalsAdminClient user={session.user} />;
}
