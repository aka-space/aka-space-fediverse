import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Post } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetPosts = (
    search = '',
    limit = 10,
    offset = 0,
    column: 'view' | 'created_at' = 'created_at'
) => {
    const token = useAuthStore((s) => s.accessToken);

    return useQuery<{ data: Post[]; hasMore: boolean }, Error>({
        queryKey: ['posts', search, limit, offset, column, token],
        queryFn: async () => {
            try {
                const direction = "descending";
                const response = await axiosInstance.get('/post', {
                    params: {
                        limit,
                        offset,
                        column,
                        direction,
                        ...(search && { search }),
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const data: Post[] = response.data.data;
                    const hasMore = response.data.has_next;

                    return { data, hasMore };
                }

                return { data: [], hasMore: false };
            } catch (error) {
                console.error('Error fetching posts:', error);
                toast.error('Error fetching posts');
                throw new Error('Error fetching posts');
            }
        },
        enabled: !!token,
        staleTime: 0,
        gcTime: 5 * 60 * 1000,
        placeholderData: { data: [], hasMore: false },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};
