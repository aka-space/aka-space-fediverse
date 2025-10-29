'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User } from 'lucide-react';
import { RegisterFormData, registerSchema } from '@/schemas/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldGroup } from './ui/field';
import Image from 'next/image';

export function RegisterForm({
    className,
    onSubmit,
    ...props
}: Omit<React.ComponentProps<'div'>, 'onSubmit'> & {
    onSubmit: (data: RegisterFormData) => void;
}) {
    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const route = useRouter();
    return (
        <div className={cn('flex flex-col gap-6 ', className)} {...props}>
            <Card variant="auth">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-white font-mono">
                        Register
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <div className="grid gap-6">
                                <div className="grid gap-6 text-white">
                                    <Controller
                                        name="username"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <div className="grid gap-3 relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
                                                    <Input
                                                        {...field}
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        placeholder="Username"
                                                        autoComplete="off"
                                                        className="pl-10 placeholder:text-gray-350 selection:bg-white selection:text-black"
                                                    />
                                                </div>
                                                {fieldState.invalid && (
                                                    <FieldError
                                                        errors={[
                                                            fieldState.error,
                                                        ]}
                                                    />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <div className="grid gap-3 relative">
                                        <Controller
                                            name="email"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <div className="grid gap-3 relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
                                                        <Input
                                                            {...field}
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                            placeholder="Email"
                                                            autoComplete="off"
                                                            className="pl-10 placeholder:text-gray-350 selection:bg-white selection:text-black"
                                                        />
                                                    </div>
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3 relative">
                                        <Controller
                                            name="password"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <div className="grid gap-3 relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
                                                        <Input
                                                            {...field}
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                            type="password"
                                                            placeholder="Password"
                                                            autoComplete="on"
                                                            className="pl-10 placeholder:text-gray-350 selection:bg-white selection:text-black"
                                                        />
                                                    </div>
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3 relative">
                                        <Controller
                                            name="confirmPassword"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <div className="grid gap-3 relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
                                                        <Input
                                                            {...field}
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                            type="password"
                                                            placeholder="Confirm password"
                                                            autoComplete="on"
                                                            className="pl-10 placeholder:text-gray-350 selection:bg-white selection:text-black"
                                                        />
                                                    </div>
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="light"
                                        className="h-10"
                                    >
                                        Register
                                    </Button>
                                </div>
                                
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="text-sm text-gray-200">
                                            Or continue with
                                        </span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>
                                    <div className="flex gap-5 justify-center pt-2">
                                        <Image
                                            className="rounded-full w-11 cursor-pointer"
                                            src="/logo-google.jpg"
                                            alt="Login With GG"
                                            width={35}
                                            height={35}
                                        />

                                        <Image
                                            className="rounded-full w-11 cursor-pointer"
                                            src="/logo-github.jpg"
                                            alt="Login With GG"
                                            width={35}
                                            height={35}
                                        />
                                    </div>
                                </div>

                                <div className="text-center text-sm text-white">
                                    Already have an account?{' '}
                                    <a
                                        href="#"
                                        className="hover:underline font-semibold"
                                        onClick={() => {
                                            route.push('/login');
                                        }}
                                    >
                                        Login
                                    </a>
                                </div>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
