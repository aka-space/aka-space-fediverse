import { useQuery } from '@tanstack/react-query';

export const useGetPosts = (api: string) => {
    return useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await fetch(api, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
    });
};
