'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import apiClient from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { Plus } from 'lucide-react';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await apiClient.get('players/');
        const formatted = res.data.map((p: any) => ({
          ...p,
          username: p.user?.username,
          email: p.user?.email,
          fullName: p.user?.first_name + ' ' + p.user?.last_name,
        }));
        setPlayers(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'position', label: 'Position' },
    { key: 'height', label: 'Height (cm)' },
    { key: 'weight', label: 'Weight (kg)' },
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Players Management</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">View and manage enrolled players.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable 
          title="All Players" 
          columns={columns} 
          data={players} 
          action={
            (user?.role === 'ADMIN' || user?.role === 'COACH') ? (
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/30">
                <Plus className="w-4 h-4" /> Add Player
              </button>
            ) : null
          }
        />
      )}
    </AppLayout>
  );
}
