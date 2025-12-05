'use client';

import { LoginForm } from '@/components/login-form';
import { useLogin } from '@/hooks/auth/use-login';
import { LoginFormData } from '@/schemas/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const login = useLogin();

    const handleSubmit = async (data: LoginFormData): Promise<void> => {
        login.mutate(data, {
            onSuccess: () => {
                toast.success('Login successfully');
                router.push('/');
            },
            onError: (error) => {
                toast.error('Invalid email or password');
                console.log('Login failed: ', error?.message);
            },
        });
    };
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-[420px] flex-col gap-6">
                <LoginForm onSubmit={handleSubmit} loading={login.isPending} />
            </div>
        </div>
    );
}
