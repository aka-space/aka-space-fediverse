'use client';
import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

export const useGetUser = () => {
    const setUser = useAuthStore((s) => s.setUser);

    return useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            const res = await axiosInstance.get('/auth/me');
            setUser(res.data);
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};
