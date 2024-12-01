'use client';

import { useUserContext } from '../context/useContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, loading, handleLogout } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    // If the user is still loading, do not perform any redirects
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return null; // Wait until loading state is false

  if (!user) return null; // If no user, do nothing (redirect happens in useEffect)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {user.email}!</h1>
      <button
        onClick={handleLogout}
        className="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
