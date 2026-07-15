import { Suspense } from 'react';
import CampaignsClient from './CampaignsClient';

export default async function CampaignsPage({ searchParams }) {
  const params = await searchParams;
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CampaignsClient initialParams={params} />
    </Suspense>
  );
}
