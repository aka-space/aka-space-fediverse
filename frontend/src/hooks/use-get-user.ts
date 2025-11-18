'use client';
import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

export const useGetUser = () => {
    const token = useAuthStore((s) => s.accessToken);
    const setUser = useAuthStore((s) => s.setUser);
    const isRefreshing = useAuthStore((s) => s.isRefreshing);

    return useQuery({
        queryKey: ['authUser'],

        queryFn: async () => {
            try {
                if (!token) return null;

                const res = await axiosInstance.get('/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(res.data);

                return res.data;
            } catch (error) {
                console.log(error);
            }
        },
        enabled: !!token && !isRefreshing,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};
