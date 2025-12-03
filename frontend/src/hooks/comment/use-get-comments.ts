import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { CommentResponse } from '@/types';

interface GetCommentsParams {
    postId: string;
    limit?: number;
}

export const useGetComments = ({ postId, limit = 20 }: GetCommentsParams) => {
    return useInfiniteQuery<CommentResponse, Error, CommentResponse, string[], string | null>({
        queryKey: ['comments', postId],
        queryFn: async ({ pageParam }): Promise<CommentResponse> => {
            const params = new URLSearchParams();
            params.append('limit', limit.toString());
            
            if (pageParam) {
                params.append('cursor', pageParam);
            }

            const response = await axiosInstance.get(
                `/post/${postId}/comment?${params.toString()}`
            );
            
            if (response.status !== 200) {
                throw new Error('Failed to fetch comments');
            }

            return response.data;
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => {
            return lastPage.next_cursor || null;
        },
        enabled: !!postId,
    });
};
