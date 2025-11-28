'use client';

import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Post } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    const token = useAuthStore((s) => s.accessToken);

    return useMutation({
        mutationFn: async (data: Post) => {
            const response = await axiosInstance.put(`/post/${data.id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status !== 204) {
                throw new Error('Failed to update post');
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error) => {
            console.error('Error updating post:', error);
        },
    });
};
