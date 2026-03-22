"use client"
import React from 'react';
import { useServerStatus } from '@/hooks/useServerStatus';
import ServerDown from '@/components/ui/ServerDown';

export default function ServerStatusWrapper({ children, showHeaderFooter = false }: { children: React.ReactNode, showHeaderFooter?: boolean }) {
    const { isServerDown } = useServerStatus();
    
    if (isServerDown) {
        return <ServerDown />;
    }
    
    return <>{children}</>;
}
