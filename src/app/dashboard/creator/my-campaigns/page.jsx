import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import MyCampaignsClient from './MyCampaignsClient';

export default async function MyCampaignsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return <MyCampaignsClient user={session.user} />;
}
