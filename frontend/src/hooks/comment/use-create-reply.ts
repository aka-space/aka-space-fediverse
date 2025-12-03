import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CreateReplyPayload {
    content: string;
}

export const useCreateReply = (commentId: string) => {
    const queryClient = useQueryClient();
    const token = useAuthStore((s) => s.accessToken);

    return useMutation({
        mutationFn: async (data: CreateReplyPayload) => {
            const response = await axiosInstance.post(
                `/comment/${commentId}/reply`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.status !== 201) {
                throw new Error('Failed to create reply');
            }

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['child-comments', commentId],
                exact: true,
            });
            toast.success('Reply posted successfully');
        },
        onError: (error) => {
            console.error('Error creating reply:', error);
            toast.error('Failed to post reply');
        },
    });
};
