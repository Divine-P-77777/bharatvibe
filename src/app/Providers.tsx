'use client'

import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { AuthProvider } from '@/hooks/useAuth'
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { LenisScrollProvider } from '@/hooks/useLenisScroll'; 

export function Providers({ children }: { children: React.ReactNode }) {
  const [storeState, setStoreState] = useState<any>(null);

  useEffect(() => {
    const initStore = async () => {
      const { makeStore } = await import('@/store/store');
      const { store, persistor } = makeStore();
      setStoreState({ store, persistor });
    };

    initStore();
  }, []);

  if (!storeState) return null;
  return (
    <Provider store={storeState.store}>
      <TooltipProvider>
        <ToastProvider>
          <AuthProvider>
            <LenisScrollProvider>
              {children}
            </LenisScrollProvider>
            <Toaster />
          </AuthProvider>
          <ToastViewport />
        </ToastProvider>
      </TooltipProvider>
    </Provider>
  );
}
