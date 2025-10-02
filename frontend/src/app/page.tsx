'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <Button>Click me</Button>
            <br />
            <Button onClick={() => router.push('/login')}>
                Click me login
            </Button>
        </div>
    );
}
