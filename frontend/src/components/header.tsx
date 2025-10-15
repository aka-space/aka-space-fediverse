'use client';
import { Bell, CirclePlus, Search, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { UserMenu } from './user-menu';
import { Button } from './ui/button';

type HeaderProps = {
    isLogged: boolean;
    showInput: boolean;
};

export default function Header({ isLogged, showInput }: HeaderProps) {
    const router = useRouter();

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`flex fixed top-0 w-full items-center justify-between px-4 py-2 transition-all duration-300 z-50
        ${
            isScrolled
                ? 'backdrop-blur-md bg-white/50 shadow-md shadow-gray-100'
                : 'bg-white shadow-md shadow-gray-200'
        }`}
        >
            {/* Logo */}
            <div
                onClick={() => {
                    router.push('/');
                }}
                className="flex items-center"
            >
                <Image src="/logo.png" alt="Logo" width={38} height={38} />
                <span className="font-bold text-xl">AKA</span>
            </div>
            {showInput && (
                <div>
                    <div className="flex w-xl">
                        <div className="relative w-full pr-5 ">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                className="pl-12 bg-gray-100 border-0 w-full rounded-full text-2xl"
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* Menu */}
            {isLogged === false ? (
                <ul className="flex items-center gap-5">
                    <Button
                        variant="dark"
                        size="lg"
                        onClick={() => {
                            router.push('/register');
                        }}
                    >
                        <UserPlus className="size-3" />
                        Register
                    </Button>
                    <Button
                        variant="light"
                        size="lg"
                        onClick={() => {
                            router.push('/login');
                        }}
                    >
                        Login
                    </Button>
                </ul>
            ) : (
                <div className="flex items-center gap-7">
                    <Button variant="rounded" size="default">
                        <CirclePlus className="size-3" />
                        Create
                    </Button>

                    <Bell size={23} className="text-gray-400" />

                    <UserMenu />
                </div>
            )}
        </header>
    );
}
