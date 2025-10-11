'use client';
import { Bell, CirclePlus, Search, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Input } from './ui/input';
import { UserMenu } from './user-menu';
import { Button } from './ui/button';

type HeaderProps = {
    isLogged: boolean;
    showInput: boolean;
};

export default function Header({ isLogged, showInput }: HeaderProps) {
    const router = useRouter();
    return (
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md shadow-gray-200">
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
                        <UserPlus size={18} />
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
                    <button className="rounded-full bg-gray-300 w-25 h-9 flex items-center gap-1 justify-center ">
                        <CirclePlus size={15} />
                        Create
                    </button>

                    <Bell size={30} className="text-gray-400" />

                    <UserMenu />
                </div>
            )}
        </header>
    );
}
