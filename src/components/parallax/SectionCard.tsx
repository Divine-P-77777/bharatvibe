// components/parallax/SectionCard.tsx
'use client';
import { motion } from 'framer-motion';

export default function SectionCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="relative rounded-3xl border bg-opacity-90 backdrop-blur-xl p-8 shadow-2xl"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold mb-8 sticky top-0 bg-inherit z-10 py-4">
        {title}
      </h2>
      <div className="space-y-8">{children}</div>
    </motion.div>
  );
}