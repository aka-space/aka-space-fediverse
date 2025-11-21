import { useQuery } from '@tanstack/react-query';

const API_URL = 'https://68765855814c0dfa653bba48.mockapi.io/mockTest';

export const useGetDetailPost = (id: string) => {
    return useQuery({
        queryKey: ['post'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
    });
};
