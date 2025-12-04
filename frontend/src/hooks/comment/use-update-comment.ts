'use client';

import { axiosInstance } from '@/lib/axios';
import { Comment } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Comment) => {
            const response = await axiosInstance.put(
                `/comments/${data.id}`,
                data,
            );
            if (response.status !== 204) {
                throw new Error('Failed to update comment');
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        },
        onError: (error) => {
            console.error('Error updating comment:', error);
        },
    });
};
