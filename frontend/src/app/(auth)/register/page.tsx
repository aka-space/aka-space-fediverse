'use client';

import { RegisterForm } from '@/components/register-form';
import { RegisterFormData } from '@/schemas/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterPage() {
    const route = useRouter();

    const { register } = useAuthStore();

    const handleSubmit = async (data: RegisterFormData): Promise<void> => {
        if (data.confirmPassword.match(data.password)) {
            const res = await register(data);
            if (res) {
                toast.success('Register successfully');
                route.push('/');
            }
        } else {
            toast.error('Register failed');
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-[460px] flex-col gap-6">
                <RegisterForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
