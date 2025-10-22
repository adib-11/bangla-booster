import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Solvio',
  description: 'Sign up or log in to Solvio',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
