import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import AddCampaignClient from './AddCampaignClient';

export default async function AddCampaignPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return <AddCampaignClient user={session?.user} />;
}
