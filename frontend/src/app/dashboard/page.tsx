'use client';

import AppLayout from '@/components/layout/AppLayout';
import useAuthStore from '@/store/authStore';
import { Users, UserSquare2, GraduationCap, Calendar, TrendingUp, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <div className="glass-card p-6 flex items-center gap-4">
    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClass}`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold dark:text-white">{value}</h3>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Welcome back, {user?.username}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Here&apos;s an overview of your club statistics.</p>
      </div>

      {user?.role === 'ADMIN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Coaches" value="12" icon={UserSquare2} colorClass="bg-gradient-to-br from-blue-500 to-blue-600" />
          <StatCard title="Total Players" value="148" icon={Users} colorClass="bg-gradient-to-br from-indigo-500 to-indigo-600" />
          <StatCard title="Active Students" value="320" icon={GraduationCap} colorClass="bg-gradient-to-br from-purple-500 to-purple-600" />
          <StatCard title="Sessions Today" value="8" icon={Calendar} colorClass="bg-gradient-to-br from-pink-500 to-pink-600" />
        </div>
      )}

      {(user?.role === 'COACH' || user?.role === 'STAFF') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="My Players" value="24" icon={Users} colorClass="bg-gradient-to-br from-blue-500 to-blue-600" />
          <StatCard title="Upcoming Sessions" value="5" icon={Calendar} colorClass="bg-gradient-to-br from-indigo-500 to-indigo-600" />
          <StatCard title="Weekly Attendance" value="92%" icon={Activity} colorClass="bg-gradient-to-br from-green-500 to-green-600" />
        </div>
      )}

      {user?.role === 'PLAYER' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="My Sessions" value="3" icon={Calendar} colorClass="bg-gradient-to-br from-indigo-500 to-indigo-600" />
          <StatCard title="Attendance Rate" value="98%" icon={Activity} colorClass="bg-gradient-to-br from-green-500 to-green-600" />
          <StatCard title="Performance" value="Good" icon={TrendingUp} colorClass="bg-gradient-to-br from-blue-500 to-blue-600" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors p-2 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white">New training session added</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-black border-none text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <h2 className="text-xl font-semibold mb-2 relative z-10">System Status</h2>
          <p className="text-indigo-200 mb-6 relative z-10 text-sm">All services are running smoothly.</p>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <span className="text-sm">API Server</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs border border-green-500/20">Online</span>
            </div>
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <span className="text-sm">Database Sync</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs border border-green-500/20">Online</span>
            </div>
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <span className="text-sm">Storage Server</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs border border-green-500/20">Online</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
