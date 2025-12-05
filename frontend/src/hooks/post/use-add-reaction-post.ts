'use client';

import { ReactionType } from '@/components/reaction-picker';
import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Post } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddReactionPost = () => {
    const queryClient = useQueryClient();
    const token = useAuthStore((s) => s.accessToken);

    return useMutation({
        mutationFn: async ({
            data,
            kind,
        }: {
            data: Post;
            kind: ReactionType;
        }) => {
            const response = await axiosInstance.post(
                `/post/${data.id}/react`,
                { kind },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (response.status !== 204) {
                throw new Error('Failed to add reaction to post');
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            console.log('Post reaction added successfully');
        },
        onError: (error) => {
            console.error('Error adding reaction to post:', error);
        },
    });
};
