import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import PurchaseCreditClient from './PurchaseCreditClient';

export default async function PurchaseCreditPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <PurchaseCreditClient user={session.user} />;
}
