'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCreatePostStore } from '@/store/useCreatePostStore';

const API_URL = 'https://68765855814c0dfa653bba48.mockapi.io/mockTest';

interface PostData {
    title: string;
    overview: string;
    content: string;
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    const { resetPostData } = useCreatePostStore();

    return useMutation({
        mutationFn: async (data: PostData) => {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });

            resetPostData();
        },
        onError: (error) => {
            console.error('Error creating post:', error);
        },
    });
};
