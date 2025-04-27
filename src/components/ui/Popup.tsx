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
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 backdrop-blur-3xl flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Popup