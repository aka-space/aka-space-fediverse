import { axiosInstance } from '@/lib/axios';
import { UserLogin, UserRegister } from '@/types';
import { toast } from 'sonner';
import { create } from 'zustand';

interface AuthState {
    accessToken?: string | null;
    authUser: UserRegister | null;
    isLoggingIn: boolean;
    isRegisting: boolean;
    register: (data: UserRegister) => Promise<boolean | undefined>;
    login: (data: UserLogin) => Promise<boolean | undefined>;
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
            const message =
                error instanceof Error && error.message.includes('400')
                    ? 'Email already exists'
                    : 'Register failed. Please try again.';

            toast.error(message);
            console.log('Register ERROR: ', error);
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
            console.log('Login ERROR: ', error);
            set({ authUser: null, isLoggingIn: false });
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
            console.error('Refresh access token ERROR:', error);
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
                toast.success('Logout successfully');
            }
        } catch (err) {
            toast.error('Logout failed. Please try again.');
            console.log('Logout ERROR: ', err);
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
            console.log('Get user ERROR:', error);
        }
    },

    initAuth: async () => {
        try {
            get().getUser();
        } catch (err) {
            console.error('initAuth ERROR:', err);
            localStorage.removeItem('accessToken');
        }
    },
}));
