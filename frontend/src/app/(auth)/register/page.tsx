'use client';

import { RegisterForm } from '@/components/register-form';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

interface formData {
    username: string;
    email: string;
    password: string;
}

export default function RegisterPage() {
    const route = useRouter();
    const [formData, setFormData] = useState<formData>({
        username: '',
        email: '',
        password: '',
    });

    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const { register } = useAuthStore() as {
        register?: (data?: formData) => Promise<void>;
    };

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement | HTMLDivElement>,
    ) => {
        e.preventDefault();
        console.log(formData);
        if (confirmPassword.match(formData.password)) {
            const res = await register?.(formData);
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
                <RegisterForm
                    data={formData}
                    setData={setFormData}
                    confirm={confirmPassword}
                    setConfirm={setConfirmPassword}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
