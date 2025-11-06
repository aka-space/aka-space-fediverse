import Image from 'next/image';

interface LayoutProps {
    children: React.ReactNode;
}
export default function AuthLayout({ children }: LayoutProps) {
    return (
        <div className="">
            <main className="min-h-screen relative">
                <Image
                    src="/background.jpg"
                    alt="Background"
                    fill
                    className="object-cover z-0"
                    priority
                />
                <div className="relative z-10">{children}</div>
            </main>
        </div>
    );
}
