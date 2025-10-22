import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getOwnerById } from '@/lib/db';
import SubdomainSetupClient from './SubdomainSetupClient';

export default async function SubdomainSetupPage() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect('/login');
  }
  
  // Check if user already has a real subdomain (not temp-*)
  const userId = (session.user as any).id;
  const owner = await getOwnerById(userId);
  
  if (owner && owner.subdomain && !owner.subdomain.startsWith('temp-')) {
    // User already has a subdomain, redirect to admin
    redirect('/admin');
  }
  
  return <SubdomainSetupClient />;
}
