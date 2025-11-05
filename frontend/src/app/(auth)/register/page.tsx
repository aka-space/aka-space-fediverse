'use client';

import { RegisterForm } from '@/components/register-form';
import { RegisterFormData } from '@/schemas/auth-schema';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const route = useRouter();

    const { register } = useAuthStore();

    const handleSubmit = async (data: RegisterFormData): Promise<void> => {
        if (data.confirmPassword.match(data.password)) {
            const res = await register(data);
            if (res) {
                route.push('/');
                console.log('Register successfully!');
            }
        } else {
            console.log('ERROR!');
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
