import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const { refreshAccessToken } = useAuthStore.getState();

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;

            const newToken = await refreshAccessToken();

            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } else {
                console.log('Do not have new token');
            }
        }

        return Promise.reject(error);
    },
);
