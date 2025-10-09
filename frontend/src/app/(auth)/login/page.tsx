import FloatingInput from '@/components/floating-input';
import { Button } from '@/components/ui/button';
import React from 'react';

const LoginPage = () => {
    return (
        <form className="flex flex-col gap-4 pt-16 pb-24 w-full max-w-md px-8 bg-card rounded-lg shadow-md">
            <h1 className="text-3xl text-center font-bold mb-2">Login</h1>
            <span className="text-md text-muted-foreground mb-2">
                Get more features and privileges by joining to the most helpful
                community
            </span>
            <FloatingInput label="Username" id="username" />
            <FloatingInput label="Password" id="password" type="password" />
            <label className="text-sm text-destructive cursor-pointer font-semibold">
                Wrong password!
            </label>
            <Button type="submit" variant="default" size="lg">
                Login
            </Button>
        </form>
    );
};

export default LoginPage;
