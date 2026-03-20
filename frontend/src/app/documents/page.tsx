'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import apiClient from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { Upload } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await apiClient.get('documents/');
        const formatted = res.data.map((d: any) => ({
          ...d,
          uploaded_at: new Date(d.uploaded_at).toLocaleDateString(),
          file_link: (
            <a href={d.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              View File
            </a>
          )
        }));
        setDocuments(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const columns = [
    { key: 'title', label: 'Document Title' },
    { key: 'document_type', label: 'Type' },
    { key: 'uploaded_at', label: 'Uploaded On' },
    { key: 'file_link', label: 'File' },
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Documents</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">Manage club contracts, medical records, and ID proofs.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable 
          title="My Documents" 
          columns={columns} 
          data={documents} 
          action={
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/30">
              <Upload className="w-4 h-4" /> Upload Document
            </button>
          }
        />
      )}
    </AppLayout>
  );
}
