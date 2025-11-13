'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'https://68765855814c0dfa653bba48.mockapi.io/comment';

interface CreateCommentData {
    comment: string;
    author: {
        name: string | undefined;
        avatar: string;
    };
    postId: string;
    commentId: string | null;
    createdAt: string;
    likes: number;
}

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateCommentData) => {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to create comment');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });

        },
        onError: (error) => {
            console.error('Error creating comment:', error);
        },
    });
};
