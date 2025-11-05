'use client';

import Loading from '@/components/loading';
import { LoginForm } from '@/components/login-form';
import { LoginFormData } from '@/schemas/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const route = useRouter();
    const { login } = useAuthStore();

    const handleSubmit = async (data: LoginFormData): Promise<void> => {
        setLoading(true);
        try {
            const res = await login(data);
            if (res) {
                toast.success('Login successfully');
                route.push('/');
            } else {
                toast.error('Invalid email or password');
            }
        } catch (error) {
            const message =
                error instanceof Error && error.message.includes('401')
                    ? 'Invalid email or password.'
                    : 'Login failed. Please try again';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };
    if (loading) return <Loading />;
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-[460px] flex-col gap-6">
                <LoginForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
