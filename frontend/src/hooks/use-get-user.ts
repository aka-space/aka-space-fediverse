'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

export const useGetUser = () => {
    const token = useAuthStore((s) => s.accessToken);
    const getUser = useAuthStore((s) => s.getUser);

    return useQuery({
        queryKey: ['authUser', token],
        queryFn: getUser,
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};
