import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import ManageCampaignsClient from './ManageCampaignsClient';

export default async function ManageCampaignsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  return <ManageCampaignsClient user={session.user} />;
}
