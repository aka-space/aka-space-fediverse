'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Lock, User } from 'lucide-react';
import { User as user } from '@/types';

export function LoginForm({
    className,
    data,
    setData,
    onSubmit,
    ...props
}: React.ComponentProps<'div'> & {
    data?: user;
    setData?: (d: user) => void;
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
}) {
    const route = useRouter();
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card variant="auth">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-white font-mono">
                        Login
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-6 text-white">
                                <div className="grid gap-3 relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="Email"
                                        required
                                        value={data?.email}
                                        className="pl-10 placeholder:text-gray-350"
                                        onChange={(e) => {
                                            setData?.({
                                                ...(data ?? {
                                                    username: '',
                                                    email: '',
                                                    password: '',
                                                }),
                                                email: e.currentTarget.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="grid gap-3 relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        value={data?.password}
                                        required
                                        className="pl-10 placeholder:text-gray-350"
                                        onChange={(e) => {
                                            setData?.({
                                                ...(data ?? {
                                                    username: '',
                                                    email: '',
                                                    password: '',
                                                }),
                                                password: e.currentTarget.value,
                                            });
                                        }}
                                    />
                                </div>
                                <span className="text-right text-sm text-white hover:underline italic cursor-pointer">
                                    Forgot password?
                                </span>
                                <Button
                                    variant="light"
                                    size="slg"
                                    type="submit"
                                >
                                    Login
                                </Button>
                            </div>
                            <div className="text-center text-sm text-white">
                                Don&apos;t have an account?{' '}
                                <a
                                    href="#"
                                    className="hover:underline font-semibold"
                                    onClick={() => {
                                        route.push('/register');
                                    }}
                                >
                                    Register
                                </a>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
