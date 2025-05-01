'use client'

import { useEffect } from 'react'
import ReactDOM from 'react-dom'

interface PopupProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Popup = ({ isOpen, onClose, children }: PopupProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">

      <div className="absolute inset-0 bg-black/40 backdrop-blur-lg" onClick={onClose} />

   
      <div className="relative bg-white/80 dark:bg-black/50 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl backdrop-blur-xl border border-white/30 dark:border-white/10">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Popup;
