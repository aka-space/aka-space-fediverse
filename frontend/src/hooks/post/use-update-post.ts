'use client';

import { axiosInstance } from '@/lib/axios';
import { Post } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Post) => {
            const response = await axiosInstance.put(`/post/${data.id}`, data);
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
