'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import AppSidebar from './Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    setLoading(false);
  }, [checkAuth]);

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated && pathname === '/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
