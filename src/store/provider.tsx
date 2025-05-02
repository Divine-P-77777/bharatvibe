'use client'

import { ReactNode, useMemo } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { makeStore } from './store'

export function Providers({ children }: { children: ReactNode }) {
  const { store, persistor } = useMemo(() => makeStore(), [])

  return (
    <Provider store={store}>
      {persistor ? (
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      ) : (
        children
      )}
    </Provider>
  )
}
