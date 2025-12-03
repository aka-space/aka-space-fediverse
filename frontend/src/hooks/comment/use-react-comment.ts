import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useReactComment = (commentId: string, postId?: string) => {
    const queryClient = useQueryClient();
    const token = useAuthStore((s) => s.accessToken);

    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post(
                `/comment/${commentId}/react`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error('Failed to react to comment');
            }

            return response.data;
        },
        onSuccess: () => {
            if (postId) {
                queryClient.invalidateQueries({ 
                    queryKey: ['comments', postId],
                });
            }
            queryClient.invalidateQueries({ 
                queryKey: ['child-comments'],
            });
        },
        onError: (error) => {
            console.error('Error reacting to comment:', error);
            toast.error('Failed to react');
        },
    });
};