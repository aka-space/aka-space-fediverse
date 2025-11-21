import { axiosInstance } from '@/lib/axios';
import { UserLogin } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';

export const useLogin = () => {
    const queryClient = useQueryClient();
    const setAccessToken = useAuthStore((s) => s.setAccessToken);

    return useMutation({
        mutationFn: async (data: UserLogin) => {
            const res = await axiosInstance.post('auth/login', data);
            if (!res.data) {
                throw new Error('Login failed');
            }
            setAccessToken(res.data);
            return true;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
        },
    });
};
