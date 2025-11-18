'use client';
import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

export const useGetUser = () => {
    const token = useAuthStore((s) => s.accessToken);
    const setUser = useAuthStore((s) => s.setUser);

    return useQuery({
        queryKey: ['authUser', token],

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
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};
