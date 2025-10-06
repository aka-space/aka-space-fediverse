'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Shield, Settings, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    {
        title: 'Profile',
        href: '/profile',
        icon: User,
    },
    {
        title: 'Security',
        href: '/security',
        icon: Shield,
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
    },
    {
        title: 'My Posts',
        href: '/my-posts',
        icon: FileText,
    },
];

export function AccountNav() {
    const pathname = usePathname();

    return (
        <nav className="w-64 space-y-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                            isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                    >
                        <Icon className="h-5 w-5" />
                        {item.title}
                    </Link>
                );
            })}
        </nav>
    );
}
