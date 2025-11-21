import { useQuery } from '@tanstack/react-query';
const API_URL = 'https://68765855814c0dfa653bba48.mockapi.io/comment';

export const useGetComments = () => {
    return useQuery({
        queryKey: ['comments'],
        queryFn: async () => {
            const response = await fetch(API_URL, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        },
    });
};
