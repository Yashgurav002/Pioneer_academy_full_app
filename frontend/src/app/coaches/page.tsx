'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import apiClient from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { Plus } from 'lucide-react';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await apiClient.get('coaches/');
        // Mapping complex embedded data for visual presentation
        const formatted = res.data.map((c: any) => ({
          ...c,
          username: c.user?.username,
          email: c.user?.email,
          fullName: c.user?.first_name + ' ' + c.user?.last_name,
        }));
        setCoaches(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'experience_years', label: 'Experience (Yrs)' },
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Coaches Management</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">View and manage club coaching staff.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable 
          title="All Coaches" 
          columns={columns} 
          data={coaches} 
          action={
            user?.role === 'ADMIN' ? (
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30">
                <Plus className="w-4 h-4" /> Add Coach
              </button>
            ) : null
          }
        />
      )}
    </AppLayout>
  );
}
