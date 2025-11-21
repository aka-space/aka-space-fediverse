import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRegister } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useRegister = () => {
    const queryClient = useQueryClient();
    const setAccessToken = useAuthStore((s) => s.setAccessToken);

    return useMutation({
        mutationFn: async (data: UserRegister) => {
            const res = await axiosInstance.post('auth/register', data);
            if (!res.data) {
                throw new Error('Register failed');
            }
            setAccessToken(res.data);
            return true;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
        },
    });
};
