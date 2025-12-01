import { axiosInstance } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
    const router = useRouter();

    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const setAuthUser = useAuthStore((s) => s.setUser);

    return useMutation({
        mutationFn: async () => {
            await axiosInstance.post('auth/logout');
            setAccessToken(null);
            setAuthUser(null);
            return true;
        },
        onSuccess: () => {
            router.push('/');
            toast.success('Logout successfully');
        },
        onError: () => {
            toast.error('Logout failed');
        },
    });
};
