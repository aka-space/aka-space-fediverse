import Image from 'next/image';
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen w-full flex flex-col bg-background overflow-hidden">
            {/* TODO: Header */}
            <main className="relative w-full px-4 py-6 mt-16 max-w-7xl mx-auto flex justify-center items-center h-[calc(100vh-128px)]">
                {/* Decorative speech bubbles */}
                <div className="absolute hidden lg:block left-40 top-40 w-40 h-40 opacity-80">
                    <Image
                        src="/images/speech-bubble.png"
                        alt=""
                        fill
                        className="w-full h-full object-contain rotate-y-180"
                    />
                </div>

                <div className="absolute hidden lg:block right-24 top-80 w-48 h-48 opacity-80">
                    <Image
                        src="/images/speech-bubble.png"
                        alt=""
                        fill
                        className="w-full h-full object-contain"
                    />
                </div>
                {children}
            </main>
        </div>
    );
};

export default Layout;
