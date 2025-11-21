'use client';

import { Post } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'https://68765855814c0dfa653bba48.mockapi.io/mockTest';

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Post) => {
            const response = await fetch(`${API_URL}/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to update post');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error) => {
            console.error('Error updating post:', error);
        },
    });
};
