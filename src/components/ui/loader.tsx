'use client'

import { useAppSelector } from '@/store/hooks'
import { tailChase } from 'ldrs'
import { motion } from 'framer-motion'

tailChase.register()

interface LoaderProps {
  fullScreen?: boolean; // optional: full screen loader or partial
}

export default function Loader({ fullScreen = true }: LoaderProps) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode)

  return (
    <div className={`z-50 ${fullScreen ? 'fixed inset-0' : 'relative w-full h-full'} flex items-center justify-center`}>
      {/* Blurred Background */}
      <div className={`absolute inset-0 ${fullScreen ? 'bg-black/30 backdrop-blur-3xl' : 'bg-transparent backdrop-blur-2xl'}`} />

      {/* Loader Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.3 }}
        className={`relative p-6 rounded-3xl border 
          ${isDarkMode 
            ? 'bg-gray-900 border-orange-400' 
            : 'bg-white border-orange-500'
          }
          flex items-center justify-center
        `}
      >
        <l-tail-chase 
          size="40" 
          speed="1.75" 
          color={isDarkMode ? '#f97316' : '#ea580c'} 
        />
      </motion.div>
    </div>
  )
}
