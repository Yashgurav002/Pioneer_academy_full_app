'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import apiClient from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { Plus } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await apiClient.get('students/');
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const columns = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'guardian_name', label: 'Guardian' },
    { key: 'contact', label: 'Contact' },
    { key: 'joining_date', label: 'Joined On' },
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Students Management</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">View and manage student records.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable 
          title="All Students" 
          columns={columns} 
          data={students} 
          action={
            (user?.role === 'ADMIN' || user?.role === 'STAFF') ? (
              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/30">
                <Plus className="w-4 h-4" /> Add Student
              </button>
            ) : null
          }
        />
      )}
    </AppLayout>
  );
}
