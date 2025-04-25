'use client'

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { AuthProvider } from '@/(subcomponents)/Auth/AuthProvider'; // Adjust the import based on your project structure
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
