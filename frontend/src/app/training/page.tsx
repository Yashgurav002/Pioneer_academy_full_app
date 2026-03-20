'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import apiClient from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { Plus } from 'lucide-react';

export default function TrainingPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await apiClient.get('training/');
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const columns = [
    { key: 'title', label: 'Session Title' },
    { key: 'coach_name', label: 'Coach' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'location', label: 'Location' },
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Training Sessions</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">View and manage scheduled training sessions.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable 
          title="Scheduled Sessions" 
          columns={columns} 
          data={sessions} 
          action={
            (user?.role === 'ADMIN' || user?.role === 'COACH') ? (
              <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-pink-500/30">
                <Plus className="w-4 h-4" /> Schedule Session
              </button>
            ) : null
          }
        />
      )}
    </AppLayout>
  );
}
