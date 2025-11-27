import { axiosInstance } from '@/lib/axios';
import { UserRegister } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    authUser: UserRegister | null;
    setUser: (user: UserRegister | null) => void;
    setAccessToken: (token: string | null) => void;
    refreshAccessToken: () => Promise<string | null>;
    logout: () => Promise<boolean>;
    getUser: () => Promise<UserRegister | null>;
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

            logout: async () => {
                try {
                    await axiosInstance.post('/auth/logout');
                    set({ authUser: null, accessToken: null });
                    localStorage.removeItem('auth-storage');
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
