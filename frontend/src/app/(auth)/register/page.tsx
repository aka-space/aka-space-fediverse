'use client';

import Loading from '@/components/loading';
import { RegisterForm } from '@/components/register-form';
import { RegisterFormData } from '@/schemas/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);

    const route = useRouter();

    const { register } = useAuthStore();

    const handleSubmit = async (data: RegisterFormData): Promise<void> => {
        setLoading(true);
        if (data.confirmPassword.match(data.password)) {
            const res = await register(data);
            if (res) {
                setLoading(false);
                toast.success('Register successfully');
                route.push('/');
            }
        } else {
            toast.error('Register failed');
        }
    };
    if (loading) return <Loading />;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-[460px] flex-col gap-6">
                <RegisterForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
