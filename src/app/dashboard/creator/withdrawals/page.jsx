import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import WithdrawalsClient from './WithdrawalsClient';

export default async function WithdrawalsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <WithdrawalsClient user={session.user} />;
}
