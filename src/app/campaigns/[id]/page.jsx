import { notFound } from 'next/navigation';
import CampaignDetailsClient from './CampaignDetailsClient';

export default async function CampaignDetailsPage({ params }) {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) return notFound();

    const campaign = await res.json();
    if (!campaign || !campaign._id) return notFound();

    return <CampaignDetailsClient campaign={campaign} />;
}
