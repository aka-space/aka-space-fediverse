import { Post } from '@/types';
import { useQuery } from '@tanstack/react-query';
const API_URL = 'https://68765855814c0dfa653bba48.mockapi.io/mockTest';

export const useGetPosts = (search: string = '') => {
    return useQuery<Post[], Error>({
        queryKey: ['posts', search],
        queryFn: async () => {
            const response = await fetch(API_URL, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Post[] = await response.json();

            if (search.trim() === '') return data;
            return data.filter(
                (post: Post) =>
                    post.title.toLowerCase().includes(search.toLowerCase()) ||
                    post.content.toLowerCase().includes(search.toLowerCase()),
            );
        },
        staleTime: 5000,
        placeholderData: [] as Post[],
    });
};
