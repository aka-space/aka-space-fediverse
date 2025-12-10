'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCreatePostStore } from '@/store/useCreatePostStore';
import { axiosInstance } from '@/lib/axios';
import { PostDataForCreate } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    const token = useAuthStore((s) => s.accessToken);
    const { resetPostData } = useCreatePostStore();

    return useMutation({
        mutationFn: async (data: PostDataForCreate) => {
            const response = await axiosInstance.post('/post', data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status !== 200) {
                throw new Error('Failed to create post');
            }
            return response.data;
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
