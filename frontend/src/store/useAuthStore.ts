import { axiosInstance } from '@/lib/axios';
import { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    authUser: User | null;
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
    refreshAccessToken: () => Promise<string | null>;
    getUser: () => Promise<string | null>;
    initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            authUser: null,
            accessToken: null,
            isRefreshing: false,
            setUser: (user) => set({ authUser: user }),
            setAccessToken: (token) => set({ accessToken: token }),

            refreshAccessToken: async () => {
                try {
                    const res = await axiosInstance.post('/auth/refresh');
                    const newToken = res.data;
                    set({ accessToken: newToken });
                    return newToken;
                } catch (error) {
                    console.error('Refresh accessToken ERROR:', error);
                    set({ authUser: null, accessToken: null });
                    return null;
                }
            },

            getUser: async () => {
                try {
                    const token = get().accessToken;
                    const res = await axiosInstance.get('/auth/me', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    set({ authUser: res.data });
                    return res.data;
                } catch (error) {
                    console.log('Get user ERROR', error);
                }
            },

            initAuth: async () => {
                try {
                    await get().getUser();
                } catch (err) {
                    console.error('initAuth ERROR:', err);
                }
            },
        }),

        {
            name: 'auth-storage',
        },
    ),
);
