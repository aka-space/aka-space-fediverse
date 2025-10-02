'use client';

import Link from 'next/link';
import React from 'react';
import NotificationPopover from './NotificationPopover';
import UserDropdownMenu from './UserDropdownMenu';
import { PlusCircle } from 'lucide-react';

export interface Notification {
    id: string;
    thumbnailUrl?: string;
    title: string;
    message: string;
    read?: boolean;
    createdAt: string;
}

export interface User {
    username: string;
    avatarUrl: string;
    email: string;
}

interface HeaderUserInfoProps {
    user: User;
    notifications: Notification[];
}

const HeaderUserInfo: React.FC<HeaderUserInfoProps> = ({
    user,
    notifications,
}) => {
    const hasNewNotification = notifications.some((n) => !n.read);

    return (
        <div className="flex items-center gap-4">
            <Link
                className="flex items-center gap-1 px-3 py-2 border border-transparent rounded-xl text-sm font-medium transition cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                href="/create"
            >
                <PlusCircle />
                <span>Create</span>
            </Link>
            <NotificationPopover
                notifications={notifications}
                hasNew={hasNewNotification}
            />
            <UserDropdownMenu user={user} />
        </div>
    );
};

export default HeaderUserInfo;
