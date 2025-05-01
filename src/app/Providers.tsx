'use client'

import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { AuthProvider } from '@/hooks/useAuth'
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster" // <== Add this

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <TooltipProvider>
        <ToastProvider>
          <AuthProvider>
            {children}
            <Toaster /> 
          </AuthProvider>
          <ToastViewport />
        </ToastProvider>
      </TooltipProvider>
    </Provider>
  )
}
