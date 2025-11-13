'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface LayoutProps {
    children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
    const { authUser } = useAuthStore();
    const route = useRouter();

    useEffect(() => {
        if (!authUser) {
            route.push('/login');
        }
    }, [authUser, route]);

    return <div>{children}</div>;
}
