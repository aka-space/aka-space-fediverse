'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ThumbsUp, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Comment } from '@/types';
import { formatTimeAgo } from '@/lib/format';
import { useReactComment } from '@/hooks/comment/use-react-comment';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

interface ReplyItemProps {
    reply: Comment;
    postId: string;
}

const ReplyItem = ({ reply, postId }: ReplyItemProps) => {
    const { mutate: reactReply } = useReactComment(reply.id, postId);
    const { authUser } = useAuthStore();

    const handleLikeReply = (e: React.MouseEvent) => {
        e.stopPropagation();
        reactReply();
    };

    return (
        <div className="flex gap-3">
            <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage
                    src={`/${reply.account.username.toLowerCase()}.png`}
                    alt={reply.account.username}
                />
                <AvatarFallback>
                    {reply.account.username.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-gray-900 dark:text-gray-100">
                                {reply.account.username}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTimeAgo(reply.created_at)}
                            </span>
                        </div>

                        {authUser?.email === reply.account.email && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 w-5 p-0"
                                    >
                                        <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32">
                                    <DropdownMenuItem
                                        className="text-red-600 cursor-pointer text-xs"
                                    >
                                        <Trash2 className="h-3 w-3 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                        {reply.content}
                    </p>
                </div>

                <div className="flex items-center gap-3 mt-1 ml-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-gray-600 dark:text-gray-400 hover:text-red-500"
                        onClick={handleLikeReply}
                    >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        <span className="text-xs">Like</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReplyItem;