import { axiosInstance } from '@/lib/axios';
import { UserRegister } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    isRefreshing: boolean;
    authUser: UserRegister | null;
    setUser: (user: UserRegister | null) => void;
    setAccessToken: (token: string | null) => void;
    refreshAccessToken: () => Promise<string | null>;
    logout: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            authUser: null,
            accessToken: null,
            isRefreshing: false,
            setUser: (user) => set({ authUser: user }),
            setAccessToken: (token) => set({ accessToken: token }),

            refreshAccessToken: async () => {
                set({ isRefreshing: true });
                try {
                    const res = await axiosInstance.post('/auth/refresh');
                    const newToken = res.data;
                    set({ accessToken: newToken });
                    return newToken;
                } catch (error) {
                    console.error('Refresh accessToken ERROR:', error);
                    set({ authUser: null, accessToken: null });
                    return null;
                } finally {
                    set({ isRefreshing: false });
                }
            },

            logout: async () => {
                try {
                    await axiosInstance.post('/auth/logout');
                    set({ authUser: null, accessToken: null });
                    return true;
                } catch (err) {
                    console.log('Logout ERROR: ', err);
                    return false;
                }
            },
        }),
        {
            name: 'auth-storage',
        },
    ),
);
