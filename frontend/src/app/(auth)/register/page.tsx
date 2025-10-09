import FloatingInput from '@/components/floating-input';
import { Button } from '@/components/ui/button';
import React from 'react';

const RegisterPage = () => {
    return (
        <form className="flex flex-col gap-4 pt-8 pb-12 w-full max-w-md px-8 bg-card rounded-lg shadow-md">
            <h1 className="text-3xl text-center font-bold mb-2">Register</h1>
            <span className="text-md text-muted-foreground mb-2">
                Get more features and priviliges by joining to the most helpful
                community
            </span>
            <FloatingInput label="Username" id="username" />
            <FloatingInput label="Email" id="email" />
            <FloatingInput
                label="Password"
                id="password"
                type="password"
                error="Longer than 8 characters"
            />
            <FloatingInput
                label="Confirm password"
                id="cf-password"
                type="password"
            />
            <label className="text-sm text-destructive cursor-pointer font-semibold">
                Email already in use!
            </label>
            <Button type="submit" variant="default" size="lg">
                Register
            </Button>
        </form>
    );
};

export default RegisterPage;
