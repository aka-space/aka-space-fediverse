'use client';

import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Post } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateViewPost = () => {
    const queryClient = useQueryClient();
    const token = useAuthStore((s) => s.accessToken);

    return useMutation({
        mutationFn: async (data: Post) => {
            const response = await axiosInstance.post(
                `/post/${data.id}/view`,
                null,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (response.status !== 204) {
                throw new Error('Failed to update view count for post');
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            console.log('Post view count updated successfully');
        },
        onError: (error) => {
            console.error('Error updating view count for post:', error);
        },
    });
};
