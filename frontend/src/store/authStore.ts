import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface User {
  user_id: number;
  role: 'ADMIN' | 'COACH' | 'STAFF' | 'PLAYER';
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (access, refresh) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    const decoded: User = jwtDecode(access);
    set({ user: decoded, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded: User = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          set({ user: null, isAuthenticated: false });
        } else {
          set({ user: decoded, isAuthenticated: true });
        }
      } catch (e) {
        set({ user: null, isAuthenticated: false });
      }
    }
  },
}));

export default useAuthStore;
