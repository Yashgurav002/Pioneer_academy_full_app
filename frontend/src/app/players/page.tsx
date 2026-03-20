'use client';

import { useEffect, useState, FormEvent } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DataTable, { Column } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import apiClient from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { Plus, Trash2 } from 'lucide-react';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', first_name: '', last_name: ''
  });

  const { user } = useAuthStore();

  const fetchPlayers = async () => {
    try {
      const res = await apiClient.get('players/');
      const formatted = res.data.map((p: any) => ({
        ...p,
        username: p.user?.username,
        email: p.user?.email,
        fullName: `${p.user?.first_name || ''} ${p.user?.last_name || ''}`.trim(),
        userId: p.user?.id,
      }));
      setPlayers(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create User with role PLAYER
      await apiClient.post('users/', { ...formData, role: 'PLAYER' });
      setIsAddOpen(false);
      setFormData({ username: '', email: '', password: '', first_name: '', last_name: '' });
      fetchPlayers();
    } catch (err: any) {
      alert('Error creating player: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to permanently delete this Player account?')) return;
    try {
      await apiClient.delete(`users/${userId}/`);
      fetchPlayers();
    } catch (err: any) {
      alert('Failed to delete player. ' + (err.response?.data?.detail || ''));
    }
  };

  const columns: Column[] = [
    { key: 'username', label: 'Username' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'position', label: 'Position' },
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Players Management</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">View and manage the club's player roster.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable 
          title="All Players" 
          columns={columns} 
          data={players} 
          action={
            user?.role === 'ADMIN' ? (
              <button 
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-4 h-4" /> Add Player
              </button>
            ) : null
          }
          renderRowActions={user?.role === 'ADMIN' ? (row: any) => (
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => handleDelete(row.userId)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete Player"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : undefined}
        />
      )}

      {/* Add Player Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Player">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input required type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input required type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input required type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Password</label>
            <input required type="password" minLength={8} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white" />
          </div>
          
          <div className="pt-4 flex gap-3 justify-end">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50">
              {isSubmitting ? 'Creating...' : 'Create Player'}
            </button>
          </div>
        </form>
      </Modal>

    </AppLayout>
  );
}
