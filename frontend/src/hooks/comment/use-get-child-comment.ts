import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { Comment } from '@/types';

export const useGetChildComments = (commentId: string) => {
    return useQuery({
        queryKey: ['child-comments', commentId],
        queryFn: async (): Promise<Comment[]> => {
            const response = await axiosInstance.get(
                `/comment/${commentId}/child`,
            );

            if (response.status !== 200) {
                throw new Error('Failed to fetch child comments');
            }

            return response.data;
        },
        enabled: !!commentId,
    });
};
