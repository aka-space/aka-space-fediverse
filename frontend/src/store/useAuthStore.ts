import { axiosInstance } from '@/lib/axios';
import { User } from '@/types';
import { create } from 'zustand';

interface AuthState {
    authUser: User | null;
    isLoggingIn: boolean;
    isRegisting: boolean;
    register: (data: User) => Promise<boolean | undefined>;
    login: (data: User) => Promise<boolean | undefined>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isLoggingIn: false,
    isRegisting: false,

    register: async (data: User) => {
        set({ isRegisting: true });
        try {
            const res = await axiosInstance.post('/authAka', data);
            if (res) {
                set({ authUser: data });
                return true;
            }
        } catch (error) {
            console.log(error);
            set({ authUser: null });
        } finally {
            set({ isRegisting: false });
        }
    },

    login: async (data: User) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.get('/authAka');
            const user = res.data.filter(
                (a: User) => a.email.toString() === data.email,
            );

            if (user[0].password === data.password) {
                set({ authUser: user[0] });
                return true;
            }
        } catch (error) {
            console.log(error);
            set({ authUser: null });
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: () => {
        try {
            set({ authUser: null });
        } catch (err) {
            console.log(err);
        }
    },
}));
