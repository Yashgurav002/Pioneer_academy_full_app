'use client';

import { useEffect, useState, FormEvent } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DataTable, { Column } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import apiClient from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { Plus, Trash2, FileText, Edit2 } from 'lucide-react';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCoachId, setEditCoachId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialForm = {
    username: '', email: '', password: '', first_name: '', last_name: '',
    dob: '', phone: '', address: '', specialization: '', experience_years: '0'
  };
  const [formData, setFormData] = useState(initialForm);
  const [files, setFiles] = useState<{resume: File|null, license: File|null, contract: File|null}>({
    resume: null, license: null, contract: null
  });

  const { user } = useAuthStore();

  const fetchCoaches = async () => {
    try {
      const res = await apiClient.get('coaches/');
      const dataList = res.data.results ? res.data.results : res.data;
      const formatted = dataList.map((c: any) => ({
        ...c,
        username: c.user?.username,
        email: c.user?.email,
        fullName: `${c.user?.first_name || ''} ${c.user?.last_name || ''}`.trim(),
        userId: c.user?.id,
      }));
      setCoaches(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key as keyof typeof formData] !== '') {
        data.append(key, formData[key as keyof typeof formData] as string);
      }
    });

    if (files.resume) data.append('resume', files.resume);
    if (files.license) data.append('license', files.license);
    if (files.contract) data.append('contract', files.contract);

    try {
      if (isEditOpen && editCoachId) {
        await apiClient.patch(`coaches/${editCoachId}/update_profile/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setIsEditOpen(false);
      } else {
        await apiClient.post('coaches/register/', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setIsAddOpen(false);
      }
      setFormData(initialForm);
      setFiles({ resume: null, license: null, contract: null });
      fetchCoaches();
    } catch (err: any) {
      alert('Error saving coach: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (coach: any) => {
    setFormData({
      username: coach.user?.username || '',
      email: coach.user?.email || '',
      password: '',
      first_name: coach.user?.first_name || '',
      last_name: coach.user?.last_name || '',
      dob: coach.dob || '', 
      phone: coach.phone || '', 
      address: coach.address || '',
      specialization: coach.specialization || '',
      experience_years: coach.experience_years?.toString() || '0'
    });
    setFiles({ resume: null, license: null, contract: null });
    setEditCoachId(coach.id); 
    setIsEditOpen(true);
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to permanently delete this Coach account?')) return;
    try {
      await apiClient.delete(`users/${userId}/`);
      fetchCoaches();
    } catch (err: any) {
      alert('Failed to delete coach. ' + (err.response?.data?.detail || ''));
    }
  };

  const columns: Column[] = [
    { key: 'username', label: 'Username' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'experience_years', label: 'Experience (Yrs)' },
  ];

  const modalBodyContent = (
    <form onSubmit={handleAddSubmit} className="space-y-5">
      {/* Section 1: User Account */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Account Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
            <input required type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
            <input required type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
          </div>
          {!isEditOpen && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input required type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Password</label>
                <input required type="password" minLength={8} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section 2: Personal Profile */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Personal Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
            <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact No.</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location of Coaching</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" placeholder="e.g., Stadium Name, City" />
          </div>
        </div>
      </div>

      {/* Section 3: Professional Files */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Professional Credentials</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialization</label>
            <input type="text" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" placeholder="e.g., Goalkeeping, Fitness" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience (Years)</label>
            <input type="number" min="0" value={formData.experience_years} onChange={(e) => setFormData({...formData, experience_years: e.target.value})} className="w-full form-input bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
          </div>
          <div className="col-span-2 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Resume (PDF/Doc)</label>
              <input type="file" onChange={(e) => setFiles({...files, resume: e.target.files?.[0] || null})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Upload License</label>
              <input type="file" onChange={(e) => setFiles({...files, license: e.target.files?.[0] || null})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Coaching Contract</label>
              <input type="file" onChange={(e) => setFiles({...files, contract: e.target.files?.[0] || null})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 dark:border-gray-800">
        <button type="button" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50">
          {isSubmitting ? 'Saving...' : (isEditOpen ? 'Save Changes' : 'Register Coach')}
        </button>
      </div>
    </form>
  );

  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Coaches Management</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">View and manage club coaching staff, their files, and details.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable 
          title="Active Coaches" 
          columns={columns} 
          data={coaches} 
          action={
            user?.role === 'ADMIN' ? (
              <button 
                onClick={() => { setFormData(initialForm); setFiles({resume: null, license: null, contract: null}); setIsAddOpen(true); }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-4 h-4" /> Add Coach
              </button>
            ) : null
          }
          renderRowActions={(row: any) => (
            <div className="flex justify-end gap-3 items-center">
              {row.resume && (
                <a href={row.resume} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center gap-1" title="View Resume">
                  <FileText className="w-4 h-4" /> <span className="text-xs">Resume</span>
                </a>
              )}
              {row.license && (
                <a href={row.license} target="_blank" rel="noreferrer" className="text-purple-500 hover:text-purple-700 flex items-center gap-1" title="View License">
                  <FileText className="w-4 h-4" /> <span className="text-xs">License</span>
                </a>
              )}
              {row.contract && (
                <a href={row.contract} target="_blank" rel="noreferrer" className="text-green-500 hover:text-green-700 flex items-center gap-1" title="View Contract">
                  <FileText className="w-4 h-4" /> <span className="text-xs">Contract</span>
                </a>
              )}
              {user?.role === 'ADMIN' && (
                <>
                  <button 
                    onClick={() => openEdit(row)}
                    className="p-1.5 ml-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                    title="Edit Coach"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(row.userId)}
                    className="p-1.5 ml-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete Coach"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}
        />
      )}

      {/* Add / Edit Modals sharing the same body */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register New Coach">
        {modalBodyContent}
      </Modal>
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Coach Details">
        {modalBodyContent}
      </Modal>

    </AppLayout>
  );
}
