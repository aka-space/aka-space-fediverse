import { axiosInstance } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const useGetTags = () => {
    return useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const res = await axiosInstance.get('/tag');
            return res.data;
        },
    });
};
