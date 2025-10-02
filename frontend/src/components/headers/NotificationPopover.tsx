import React from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import NotificationItem from './NotificationItem';
import { type Notification } from './HeaderUserInfo';

const NotificationPopover: React.FC<{
    notifications: Notification[];
    hasNew: boolean;
}> = ({ notifications, hasNew }) => (
    <Popover>
        <PopoverTrigger asChild>
            <div className="relative inline-block">
                <Button variant="ghost" className="relative cursor-pointer">
                    <BellIcon className="h-6 w-6 scale-125" size={40} />
                </Button>
                {hasNew && (
                    <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1">
                        <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                    </span>
                )}
            </div>
        </PopoverTrigger>
        <PopoverContent
            className="w-80 max-h-96 overflow-y-auto p-0"
            align="end"
        >
            <div className="flex flex-col gap-2 p-2">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No notifications
                    </div>
                ) : (
                    notifications.map((n) => (
                        <NotificationItem key={n.id} notification={n} />
                    ))
                )}
            </div>
        </PopoverContent>
    </Popover>
);

export default NotificationPopover;

// Icon
const BellIcon: React.FC<{
    size?: number;
    color?: string;
    className?: string;
}> = ({ size = 24, color = 'currentColor', className = '', ...rest }) => (
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
        className={className}
        {...rest}
    >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
