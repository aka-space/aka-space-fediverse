'use client';

import { RegisterForm } from '@/components/register-form';
import { useRegister } from '@/hooks/use-register';
import { RegisterFormData } from '@/schemas/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterPage() {
    const route = useRouter();
    const register = useRegister();

    const handleSubmit = async (data: RegisterFormData): Promise<void> => {
        if (!data.confirmPassword.match(data.password)) {
            toast.error('Passwords do not match');
            return;
        }

        register.mutate(data, {
            onSuccess: () => {
                toast.success('Register successfully');
                route.push('/');
            },

            onError: () => {
                toast.error('Register failed');
            },
        });
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-[460px] flex-col gap-6">
                <RegisterForm
                    onSubmit={handleSubmit}
                    loading={register.isPending}
                />
            </div>
        </div>
    );
}
