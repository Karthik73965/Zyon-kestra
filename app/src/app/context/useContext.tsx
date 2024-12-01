'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { BackendUrl } from '@/constant/constants';

interface User {
  email: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  handleLogin: (token: string, userDetails: User) => void;
  handleLogout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    const isLoginOrRegisterPage = pathname === '/login' || pathname === '/register';
    const isDashboardPage = pathname.startsWith('/dashboard');

    if (token) {
      // If the token exists and user is on login/register, redirect to the intended dashboard page
      if (isLoginOrRegisterPage) {
        router.push('/dashboard');
      } else if (isDashboardPage && !user) {
        // If on a dashboard page but no user is loaded, fetch the profile
        fetchUserProfile(token);
      } else {
        setLoading(false); // No need to fetch the profile again if already fetched
      }
    } else {
      // Handle no token scenario
      if (isDashboardPage) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    }
  }, [pathname, router, user]); // Added `user` as a dependency

  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch(`${BackendUrl}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data: User = await res.json();
        setUser(data);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token: string, userDetails: User) => {
    Cookies.set('token', token);
    localStorage.setItem('token', token);
    setUser(userDetails);
    router.push('/dashboard');
  };

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{ user, loading, handleLogin, handleLogout }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
