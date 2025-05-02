'use client'

import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAppSelector } from '@/store/hooks';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup = ({ isOpen, onClose, children }: PopupProps) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
     
      <div
        className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-gray-200/60'} backdrop-blur-lg`}
        onClick={onClose}
      />

      
      <div
        className={`relative rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl backdrop-blur-xl border ${
          isDarkMode ? 'bg-black/80 text-white border-white/10' : 'bg-white/80 text-black border-white/30'
        }`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Popup;
