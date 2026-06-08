'use client';
import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { restoreAuth } from './features/auth/authSlice';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | undefined>(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  useEffect(() => {
    // Restore authentication state from localStorage on app load
    if (storeRef.current) {
      storeRef.current.dispatch(restoreAuth());
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}