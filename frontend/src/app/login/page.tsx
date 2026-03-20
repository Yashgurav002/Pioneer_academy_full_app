'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await apiClient.post('auth/login/', { username, password });
      login(res.data.access, res.data.refresh);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="glass w-full max-w-md p-8 rounded-2xl z-10">
        <div className="text-center mb-10">
          <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">FC Management</h2>
          <p className="text-white/80 mt-2 text-sm">Sign in to your account to continue</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-100 p-3 rounded-lg text-sm text-center backdrop-blur-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-300" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg bg-black/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all sm:text-sm backdrop-blur-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-300" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg bg-black/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all sm:text-sm backdrop-blur-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
