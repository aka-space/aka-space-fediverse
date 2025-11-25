'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'https://68765855814c0dfa653bba48.mockapi.io/comment';

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        },
        onError: (error) => {
            console.error('Error deleting comment:', error);
        },
    });
};
