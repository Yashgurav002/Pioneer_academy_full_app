'use client';
import AppLayout from '@/components/layout/AppLayout';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Construction } from 'lucide-react';

export default function StudentsPage() {
  const router = useRouter();
  
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
          <Construction className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold dark:text-white mb-3">Students Page Under Construction</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          We are currently working on this feature. Check back later for comprehensive student management tools.
        </p>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors hover:bg-gray-800 dark:hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    </AppLayout>
  );
}
