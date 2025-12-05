import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRegister } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const useRegister = () => {
    const setAccessToken = useAuthStore((s) => s.setAccessToken);

    return useMutation({
        mutationFn: async (data: UserRegister) => {
            const res = await axiosInstance.post('auth/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (!res.data) {
                throw new Error('Register failed');
            }
            setAccessToken(res.data);
            await useAuthStore.getState().getUser();
            return true;
        },
    });
};
