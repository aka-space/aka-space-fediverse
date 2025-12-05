'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface LayoutProps {
    children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
    const route = useRouter();

    useEffect(() => {
        const accessToken = useAuthStore.getState().accessToken;

        if (!accessToken) {
            route.push('/login');
        }
    }, [route]);
    return <div>{children}</div>;
}
