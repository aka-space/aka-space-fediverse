'use client';

import { LoginForm } from '@/components/login-form';
import { LoginFormData } from '@/schemas/auth-schema';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const route = useRouter();
    const { login } = useAuthStore();

    const handleSubmit = async (data: LoginFormData): Promise<void> => {
        console.log('Form Login send: ', data);
        try {
            const res = await login(data);
            if (res) {
                route.push('/');
                console.log('Log in successfully');
            } else {
                console.log('Invalid email or password.');
            }
        } catch (error) {
            console.log('Login ERROR', error);
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-[460px] flex-col gap-6">
                <LoginForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
