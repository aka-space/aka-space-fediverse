import { AccountNav } from '@/components/account-nav';
import Header from '@/components/header';

interface LayoutProps {
    children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen w-full flex flex-col bg-background overflow-hidden">
            <Header />
            <main className="relative w-full px-4 py-6 mt-16">
                <div className="flex gap-8 mx-auto max-w-7xl">
                    <AccountNav />
                    <div className="flex-1 max-w-4xl">{children}</div>
                </div>
            </main>
        </div>
    );
}
