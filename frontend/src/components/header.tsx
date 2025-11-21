'use client';
import { Bell, CirclePlus, Search, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { UserMenu } from './user-menu';
import { Button } from './ui/button';
import { useGetUser } from '@/hooks/use-get-user';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: user } = useGetUser();

    const hideSearch = pathname === '/login' || pathname === '/register';
    const [active, setActive] = useState<string>('');
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
                className="flex items-center cursor-pointer"
            >
                <Image src="/logo.png" alt="Logo" width={38} height={38} />
                <span className="font-bold text-xl">AKA</span>
            </div>
            {!hideSearch && (
                <div className="absolute left-1/2 transform -translate-x-1/2 sm:w-1/4 md:w-1/3 lg:w-1/2 xl:w-2/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-12 bg-gray-100 border-0 w-full rounded-full text-base sm:text-lg md:text-xl"
                        />
                    </div>
                </div>
            )}
            {/* Menu */}
            {!user ? (
                <ul className="flex items-center gap-5">
                    <Button
                        variant={active === 'register' ? 'dark' : 'light'}
                        size="lg"
                        onClick={() => {
                            setActive('register');
                            router.push('/register');
                        }}
                    >
                        <UserPlus className="size-3" />
                        Register
                    </Button>
                    <Button
                        variant={active === 'login' ? 'dark' : 'light'}
                        size="lg"
                        onClick={() => {
                            setActive('login');
                            router.push('/login');
                        }}
                    >
                        Login
                    </Button>
                </ul>
            ) : (
                <div className="flex items-center gap-7">
                    <Button
                        variant="rounded"
                        size="default"
                        onClick={() => {
                            router.push('/post/create');
                        }}
                        className=" cursor-pointer"
                    >
                        <CirclePlus className="size-3" />
                        Create
                    </Button>

                    <Bell size={23} className="text-gray-400 cursor-pointer" />

                    <UserMenu />
                </div>
            )}
        </header>
    );
}
