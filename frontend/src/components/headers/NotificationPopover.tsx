import React from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import NotificationItem from './NotificationItem';
import { type Notification } from './HeaderUserInfo';
import { BellIcon } from 'lucide-react';

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
