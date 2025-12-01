'use client';
import { Bell, CirclePlus, History, Search, UserPlus, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { UserMenu } from './user-menu';
import { Button } from './ui/button';
import { useAuthStore } from '@/store/useAuthStore';

const STORAGE_KEY = 'search-history';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { authUser } = useAuthStore();

    const hideSearch = pathname === '/login' || pathname === '/register';
    const [active, setActive] = useState<string>('');
    const [isScrolled, setIsScrolled] = useState(false);

    const searchParams = useSearchParams();
    const queryValue = searchParams.get('search') ?? '';
    const [search, setSearch] = useState(queryValue);

    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredHistory = search
        ? history.filter((item) =>
              item.toLowerCase().includes(search.toLowerCase()),
          )
        : history;

    const saveHistory = (term: string) => {
        if (!term.trim()) return;
        const newHistory = [term, ...history.filter((h) => h !== term)].slice(
            0,
            5,
        );
        setHistory(newHistory);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    };

    const handleChange = (value: string) => {
        setSearch(value);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        saveHistory(value);
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        router.replace(`${pathname}?${params.toString()}`);
        inputRef.current?.focus();
        setShowHistory(false);
    };

    useEffect(() => {
        useAuthStore.getState().initAuth();
        const handleClickOutside = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setShowHistory(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setHistory(JSON.parse(stored));

        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const deleteHistory = (item: string) => {
        const newHistory = history.filter((h) => h !== item);
        setHistory(newHistory);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <header
            className={`flex fixed top-0 w-full items-center justify-between px-4 py-2 transition-all duration-300 z-50
        ${
            isScrolled
                ? 'backdrop-blur-md bg-white/50 shadow-md shadow-gray-100'
                : 'bg-white shadow-md shadow-gray-200'
        }`}
        >
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
                    <div ref={wrapperRef} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            ref={inputRef}
                            value={search}
                            type="text"
                            placeholder="Search..."
                            onChange={(e) => handleChange(e.target.value)}
                            onFocus={() => {
                                if (history.length > 0) setShowHistory(true);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch(search);
                                }
                            }}
                            className="pl-12 bg-gray-100 border-0 w-full rounded-full text-base sm:text-sm md:text-md"
                        />
                        {showHistory && filteredHistory.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white border rounded-md mt-1 shadow-md z-50 pr-2">
                                {filteredHistory.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-r-full cursor-pointer transition-colors duration-150"
                                    >
                                        <div
                                            className="flex items-center gap-2"
                                            onClick={() => handleSearch(item)}
                                        >
                                            <History className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-700 truncate">
                                                {item}
                                            </span>
                                        </div>
                                        <X
                                            className="w-4 h-4 text-gray-400 hover:bg-gray-300 rounded-full"
                                            onClick={() => {
                                                deleteHistory(item);
                                            }}
                                        />
                                    </div>
                                ))}
                                <div
                                    className="text-sm text-center text-gray-500 py-1 cursor-pointer hover:text-red-400"
                                    onClick={clearHistory}
                                >
                                    Clear all history
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Menu */}
            {!authUser ? (
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
