'use client';

import { useEffect } from 'react';
import { useAppDispatch } from './hooks';
import { setUser } from './features/auth/authSlice';

export default function AuthRestorer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Restore auth state from localStorage on mount
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          // Restore user to Redux store
          dispatch(setUser({
            id: user.id || user.userId,
            name: user.name,
            email: user.email,
          }));
        } catch (error) {
          console.error('Failed to restore auth state:', error);
        }
      }
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
}
