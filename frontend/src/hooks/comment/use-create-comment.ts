'use client';

import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CreateCommentPayload {
    content: string;
}

export const useCreateComment = (postId: string) => {
    const queryClient = useQueryClient();
    const token = useAuthStore((s) => s.accessToken);

    return useMutation({
        mutationFn: async (data: CreateCommentPayload) => {
            const response = await axiosInstance.post(
                `/post/${postId}/comment`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.status !== 200) {
                throw new Error('Failed to create comment');
            }

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            toast.success('Comment posted successfully');
        },
        onError: (error) => {
            console.error('Error creating comment:', error);
            toast.error('Failed to post comment');
        },
    });
};
