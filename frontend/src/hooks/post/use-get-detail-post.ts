import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetDetailPost = (slug: string) => {
    const token = useAuthStore((s) => s.accessToken);
    return useQuery({
        queryKey: ['post', slug],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(`/post/${slug}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status !== 200) {
                    toast.error('Error fetching post details');
                    throw new Error('Network response was not ok');
                }
                return response.data;
            } catch (error) {
                console.error('Error fetching post details:', error);
                toast.error('Error fetching post details');
                throw error;
            }
        },
    });
};
