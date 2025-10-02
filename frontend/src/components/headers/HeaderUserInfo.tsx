'use client';

import Link from 'next/link';
import React from 'react';
import NotificationPopover from './NotificationPopover';
import UserDropdownMenu from './UserDropdownMenu';

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
                <AddCircleIcon />
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

// --- Icons ---
const AddCircleIcon: React.FC<{ size?: number; color?: string }> = ({
    size = 24,
    color = 'currentColor',
    ...props
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);
