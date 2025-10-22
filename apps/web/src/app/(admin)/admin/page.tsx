import React from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  // Get session server-side
  const session = await getServerSession(authOptions);
  
  // Check authentication (middleware already handles this, but good practice)
  if (!session || !session.user) {
    redirect('/login');
  }
  
  return <AdminDashboardClient />;
}
