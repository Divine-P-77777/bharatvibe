'use client';

import { ReactNode } from 'react';

export default function ScrollWrapper({ children }: { children: ReactNode }) {
  return (
    <div
      data-scroll-container
      className="relative w-full overflow-hidden"
    >
      {children}
    </div>
  );
}
