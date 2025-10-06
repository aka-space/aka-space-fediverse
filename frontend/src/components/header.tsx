'use client';
import { UserPlus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Header() {
    const router = useRouter();
    return (
        <header className="flex items-center justify-between px-6 py-5 bg-white shadow-md shadow-gray-200">
            {/* Logo */}
            <div
                onClick={() => {
                    router.push('/');
                }}
                className="flex items-center"
            >
                <Image src="/logo.png" alt="Logo" width={48} height={48} />
                <span className="font-bold text-2xl">AKA</span>
            </div>
            <div></div>
            {/* Menu */}
            <ul className="flex items-center gap-5">
                <button
                    onClick={() => {
                        router.push('/register');
                    }}
                    className="flex items-center bg-black text-white py-3 px-6 rounded-md gap-2 font-bold "
                >
                    <UserPlus size={18} />
                    Register
                </button>
                <button
                    onClick={() => {
                        router.push('/login');
                    }}
                    className="bg-gray-200 text-black py-3 px-6 rounded-md font-bold"
                >
                    Login
                </button>
            </ul>
        </header>
    );
}
