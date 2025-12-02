import { axiosInstance } from '@/lib/axios';
import { Post } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetPosts = (
    search = '',
    limit = 10,
    offset = 0,
    column: 'view' | 'created_at',
    filter: 'new' | 'hot',
) => {
    return useQuery<{ data: Post[]; hasMore: boolean }, Error>({
        queryKey: ['posts', search, limit, offset, column, filter],
        queryFn: async () => {
            try {
                const direction = 'descending';
                const response = await axiosInstance.get('/post', {
                    params: {
                        limit,
                        offset,
                        column,
                        direction,
                        ...(search && { query: search }),
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
        staleTime: 0,
        gcTime: 5 * 60 * 1000,
        placeholderData: { data: [], hasMore: false },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};
