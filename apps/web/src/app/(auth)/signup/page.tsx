import React from 'react';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Create Your Account
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Join Solvio and start managing your business
      </p>
      <SignupForm />
    </div>
  );
}
