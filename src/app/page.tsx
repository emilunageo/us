'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';

export default function Home() {
  const { userId, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && userId) {
      router.push('/dashboard');
    }
  }, [userId, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#808000] border-t-transparent"></div>
      </div>
    );
  }

  if (userId) {
    return null; // Will redirect
  }

  return <LoginForm />;
}
