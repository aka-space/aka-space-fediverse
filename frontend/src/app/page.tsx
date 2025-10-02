'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
    const route = useRouter();
    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <Button>Click me</Button>
            <Button
                onClick={() => {
                    route.push('/register');
                }}
            >
                Register
            </Button>
        </div>
    );
}
