interface LayoutProps {
    children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen w-full flex flex-col bg-background overflow-hidden">
            <main className="w-full px-4 py-6  xl:pl-88 md:pr-88">
                {children}
            </main>
        </div>
    );
}
