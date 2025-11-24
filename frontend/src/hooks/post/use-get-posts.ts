import { axiosInstance } from '@/lib/axios';
import { Post } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetPosts = (search = '', limit = 10, offset = 0) => {
    return useQuery<{ data: Post[]; hasMore: boolean }, Error>({
        queryKey: ['posts', search, limit, offset],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(`/post?limit=${limit}&offset=${offset}`);

                if (response.status === 200) {
                    const data: Post[] = response.data.data;
                    const hasMore = response.data.has_next;

                    if (search.trim() === '') return {data, hasMore};
                    return {data: data.filter(
                        (post: Post) =>
                            post.title
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            post.content
                                .toLowerCase()
                                .includes(search.toLowerCase()),
                    ), hasMore};
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
    });
};
