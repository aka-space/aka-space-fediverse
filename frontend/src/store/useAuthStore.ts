import { axiosInstance } from '@/lib/axios';
import { UserLogin, UserRegister } from '@/types';
import { create } from 'zustand';

interface AuthState {
    accessToken?: string | null;
    authUser: UserRegister | null;
    isLoggingIn: boolean;
    isRegisting: boolean;
    register: (data: UserRegister) => Promise<boolean | undefined>;
    login: (data: UserLogin) => Promise<boolean | undefined>;
    loginWithGG: () => Promise<void>;
    refreshAccessToken: () => Promise<string | null>;
    logout: () => Promise<void>;
    getUser: () => Promise<void>;
    initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    authUser: null,
    isLoggingIn: false,
    isRegisting: false,

    register: async (data: UserRegister) => {
        set({ isRegisting: true });
        try {
            const res = await axiosInstance.post('/auth/register', data);
            if (res) {
                localStorage.setItem('accessToken', res.data);
                get().getUser();
                return true;
            }
        } catch (error) {
            console.log('error when register: ', error);
            set({ authUser: null });
        } finally {
            set({ isRegisting: false });
        }
    },

    login: async (data: UserLogin) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            if (res) {
                localStorage.setItem('accessToken', res.data);
                get().getUser();
                return true;
            }
        } catch (error) {
            console.log('error when login: ', error);
            set({ authUser: null, isLoggingIn: false });
        } finally {
            set({ isLoggingIn: false });
        }
    },

    loginWithGG: async () => {
        set({ isLoggingIn: true });
        try {
            await axiosInstance.get('/oauth2/google');
        } catch (error) {
            console.log('error when login with google: ', error);
            set({ authUser: null });
        } finally {
            set({ isLoggingIn: false });
        }
    },

    refreshAccessToken: async () => {
        try {
            const res = await axiosInstance.post(
                '/auth/refresh',
                {},
                { withCredentials: true },
            );
            const newToken = res.data;
            localStorage.setItem('accessToken', newToken);
            return newToken;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            set({ authUser: null, accessToken: null });
            return null;
        }
    },

    logout: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                await axiosInstance.post('/auth/logout');
                localStorage.removeItem('accessToken');
                set({ authUser: null });
                console.log('Logout successful. Refresh cookie removed.');
            }
        } catch (err) {
            console.log('Error during logout:', err);
        }
    },

    getUser: async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const userRes = await axiosInstance.get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ authUser: userRes.data });
        } catch (error) {
            console.log('Get user error:', error);
        }
    },

    initAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        try {
            get().getUser();
        } catch (err) {
            console.error('initAuth error:', err);
            localStorage.removeItem('accessToken');
        }
    },
}));
