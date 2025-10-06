import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { type User } from './HeaderUserInfo';
import Link from 'next/link';

const UserDropdownMenu: React.FC<{ user: User }> = ({ user }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Avatar className="w-10 h-10 cursor-pointer">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>
                    {user.username.at(0)?.toUpperCase()}
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuGroup>
                <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs text-gray-500">
                    {user.email}
                </DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href="/my-posts">My Posts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem>Friends</DropdownMenuItem>
                <DropdownMenuItem>Following</DropdownMenuItem>
                <DropdownMenuItem>Follower</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

export default UserDropdownMenu;
