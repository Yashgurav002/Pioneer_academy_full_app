'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { User as UserIcon, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await apiClient.get('users/me/');
        setProfileData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfileData();
  }, []);

  if (!profileData) return (
    <AppLayout>
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold dark:text-white">My Profile</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">View your personal information and settings.</p>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                  {profileData?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-800">
                {profileData?.role}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</p>
                  <p className="text-lg font-semibold dark:text-white">{profileData?.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="text-lg font-semibold dark:text-white">{profileData?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account ID</p>
                  <p className="text-lg font-semibold dark:text-white">#{profileData?.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
