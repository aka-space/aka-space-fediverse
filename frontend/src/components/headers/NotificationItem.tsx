import Image from 'next/image';
import React from 'react';
import { type Notification } from './HeaderUserInfo';

const NotificationItem: React.FC<{ notification: Notification }> = ({
    notification,
}) => (
    <div
        className={`flex items-center cursor-pointer gap-2 p-2 ${
            !notification.read ? 'bg-muted' : 'bg-transparent'
        } hover:bg-accent`}
    >
        <Image
            src={notification.thumbnailUrl ?? '/images/logo.png'}
            alt="Thumbnail"
            className="h-12 w-12 rounded-full border border-border object-cover"
            width={40}
            height={40}
        />
        <div className="flex flex-col">
            <span className="font-medium">{notification.title}</span>
            <span className="text-sm text-gray-600">
                {notification.message}
            </span>
            <span className="text-xs text-gray-400">
                {new Date(notification.createdAt).toLocaleString('vi-VN')}
            </span>
        </div>
    </div>
);

export default NotificationItem;
