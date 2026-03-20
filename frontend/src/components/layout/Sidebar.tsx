'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, UserSquare2, GraduationCap, Calendar, FileText, Settings, LogOut } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';

const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home, roles: ['ADMIN', 'COACH', 'STAFF', 'PLAYER'] },
    { label: 'Coaches', href: '/coaches', icon: UserSquare2, roles: ['ADMIN', 'STAFF'] },
    { label: 'Players', href: '/players', icon: Users, roles: ['ADMIN', 'COACH', 'STAFF'] },
    { label: 'Students', href: '/students', icon: GraduationCap, roles: ['ADMIN', 'COACH', 'STAFF'] },
    { label: 'Training Sessions', href: '/training', icon: Calendar, roles: ['ADMIN', 'COACH', 'PLAYER'] },
    { label: 'Documents', href: '/documents', icon: FileText, roles: ['ADMIN', 'STAFF', 'COACH', 'PLAYER'] },
    { label: 'My Profile', href: '/profile', icon: Settings, roles: ['ADMIN', 'COACH', 'STAFF', 'PLAYER'] },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(user?.role || ''));

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">FC Admin</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {filteredNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate w-32 dark:text-gray-200">{user?.username}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
