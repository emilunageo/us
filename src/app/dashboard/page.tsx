'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Dashboard from '@/components/Dashboard';

export default function DashboardPage() {
  const { userId, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !userId) {
      router.push('/');
    }
  }, [userId, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!userId) {
    return null; // Will redirect
  }

  return <Dashboard />;
}

