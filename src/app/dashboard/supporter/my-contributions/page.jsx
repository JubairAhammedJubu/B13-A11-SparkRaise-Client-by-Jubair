import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import MyContributionsClient from './MyContributionsClient';

export default async function MyContributionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <MyContributionsClient user={session.user} />;
}
