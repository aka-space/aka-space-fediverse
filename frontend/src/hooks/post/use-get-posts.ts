import { axiosInstance } from '@/lib/axios';
import { Post } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import qs from 'qs';

export const useGetPosts = (
    search = '',
    tags: string[] = [],
    author_name = '',
    limit = 10,
    offset = 0,
    column: 'view' | 'created_at',
    filter: 'new' | 'hot',
) => {
    return useQuery<{ data: Post[]; hasMore: boolean }, Error>({
        queryKey: [
            'posts',
            search,
            limit,
            offset,
            column,
            filter,
            tags,
            author_name,
        ],
        queryFn: async () => {
            console.log('Fetching posts with params:');
            try {
                const direction = 'descending';
                const response = await axiosInstance.get('/post', {
                    params: {
                        limit,
                        offset,
                        column,
                        direction,
                        ...(author_name && { author_name }),
                        ...(tags.length > 0 && { tags }),
                        ...(search && { query: search }),
                    },
                    paramsSerializer: (params) =>
                        qs.stringify(params, { arrayFormat: 'repeat' }),
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
    });
};
