'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User } from 'lucide-react';

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
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
                    <form>
                        <div className="grid gap-6">
                            <div className="grid gap-6 text-white">
                                <div className="grid gap-3 relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        required
                                        className="pl-10 placeholder:text-gray-350"
                                    />
                                </div>
                                <div className="grid gap-3 relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        required
                                        className="pl-10 placeholder:text-gray-350"
                                    />
                                </div>
                                <div className="grid gap-3 relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        required
                                        className="pl-10 placeholder:text-gray-350"
                                    />
                                </div>
                                <div className="grid gap-3 relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Confirm password"
                                        required
                                        className="pl-10 placeholder:text-gray-350"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="slg"
                                    variant="light"
                                >
                                    Register
                                </Button>
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
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
