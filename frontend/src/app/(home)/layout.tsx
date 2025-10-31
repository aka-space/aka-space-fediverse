interface LayoutProps {
    children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen w-full flex flex-col bg-background overflow-hidden">
            <main className="w-full flex justify-center py-6 mt-16 px-4">
                <div className="w-full max-w-7xl px-4">{children}</div>
            </main>
        </div>
    );
}
