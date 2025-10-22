'use client';

import { LoginForm } from '@/components/login-form';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
    const route = useRouter();
    const [formData, setFormData] = useState<User>({
        username: '',
        email: '',
        password: '',
    });
    const { login } = useAuthStore();
    const handleSubmit = async (
        e: FormEvent<HTMLFormElement | HTMLDivElement>,
    ) => {
        e.preventDefault();
        console.log('Form Login send: ', formData);
        try {
            const res = await login(formData);
            if (res) {
                route.push('/');
                console.log('Log in successfully');
            }
        } catch (error) {
            console.log('Login ERROR', error);
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-[460px] flex-col gap-6">
                <LoginForm
                    data={formData}
                    setData={setFormData}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
