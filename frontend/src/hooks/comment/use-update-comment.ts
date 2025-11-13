'use client';

import { Comment } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'https://68765855814c0dfa653bba48.mockapi.io/comment';

export const useUpdateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Comment) => {
            const response = await fetch(`${API_URL}/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to update comment');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        },
        onError: (error) => {
            console.error('Error updating comment:', error);
        },
    });
};
