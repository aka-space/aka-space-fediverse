'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    MessageCircle,
    MoreHorizontal,
    Trash2,
    Loader2,
    ChevronDown,
    ThumbsUp,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Comment } from '@/types';
import { formatTimeAgo } from '@/lib/format';
import { useReactComment } from '@/hooks/comment/use-react-comment';
import { useCreateReply } from '@/hooks/comment/use-create-reply';
import { useGetChildComments } from '@/hooks/comment/use-get-child-comment';
import { useAuthStore } from '@/store/useAuthStore';
import ReplyInput from './reply-input';
import { toast } from 'sonner';

interface ReplyItemProps {
    reply: Comment;
    postId: string;
    depth?: number;
}

const ReplyItem = ({ reply, postId, depth = 0 }: ReplyItemProps) => {
    const [showNestedReplies, setShowNestedReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);

    const { mutate: reactReply } = useReactComment(reply.id, postId);
    const { mutate: createNestedReply, isPending: isCreatingReply } =
        useCreateReply(reply.id);
    const { data: nestedReplies, isLoading: nestedRepliesLoading } =
        useGetChildComments(reply.id);
    const { authUser } = useAuthStore();

    const handleLikeReply = (e: React.MouseEvent) => {
        e.stopPropagation();
        reactReply();
    };

    const handleReplyClick = () => {
        setIsReplying(!isReplying);
    };

    const handleCancelReply = () => {
        setIsReplying(false);
    };

    const handleSubmitNestedReply = (replyText: string) => {
        createNestedReply(
            { content: replyText },
            {
                onSuccess: () => {
                    setIsReplying(false);
                    setShowNestedReplies(true);
                    toast.success('Reply posted successfully');
                },
                onError: () => {
                    toast.error('Failed to post reply');
                },
            },
        );
    };

    const handleToggleNestedReplies = () => {
        setShowNestedReplies(!showNestedReplies);
    };

    const nestedReplyCount = nestedReplies?.length || 0;
    const maxDepth = 3;

    return (
        <div className="flex gap-3">
            <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage
                    src={reply.account.avatar_path}
                    alt={reply.account.username}
                />
                <AvatarFallback className="bg-black text-white">
                    {reply.account.username.substring(0, 2).toUpperCase()}
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
                                <DropdownMenuContent
                                    align="end"
                                    className="w-32"
                                >
                                    <DropdownMenuItem className="text-red-600 cursor-pointer text-xs">
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

                    <div className="mt-0.5">
                        {reply.reactions.like > 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                👍{reply.reactions.like}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-1 ml-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto py-1 text-gray-600 dark:text-gray-400 hover:text-blue-500"
                        onClick={handleLikeReply}
                    >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        <span className="text-xs">Like</span>
                    </Button>

                    {depth < maxDepth && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto py-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 cursor-pointer"
                            onClick={handleReplyClick}
                        >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            <span className="text-xs">Reply</span>
                        </Button>
                    )}

                    {nestedReplyCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-gray-600 dark:text-gray-400 hover:text-blue-500 cursor-pointer"
                            onClick={handleToggleNestedReplies}
                        >
                            <ChevronDown
                                className={`h-3 w-3 mr-1 transition-transform ${
                                    showNestedReplies ? 'rotate-180' : ''
                                }`}
                            />
                            <span className="text-xs">
                                {showNestedReplies ? 'Hide' : 'View'}{' '}
                                {nestedReplyCount}{' '}
                                {nestedReplyCount === 1 ? 'reply' : 'replies'}
                            </span>
                        </Button>
                    )}
                </div>

                {isReplying && (
                    <div className="mt-2">
                        <ReplyInput
                            onSubmit={handleSubmitNestedReply}
                            onCancel={handleCancelReply}
                            isSubmitting={isCreatingReply}
                        />
                    </div>
                )}

                {showNestedReplies && (
                    <div className="mt-2 ml-4 space-y-2 border-l-2 border-gray-200 dark:border-neutral-700 pl-3">
                        {nestedRepliesLoading ? (
                            <div className="flex justify-center py-2">
                                <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
                            </div>
                        ) : nestedReplies && nestedReplies.length > 0 ? (
                            nestedReplies.map((nestedReply: Comment) => (
                                <ReplyItem
                                    key={nestedReply.id}
                                    reply={nestedReply}
                                    postId={postId}
                                    depth={depth + 1}
                                />
                            ))
                        ) : (
                            <p className="text-xs text-gray-500 text-center py-2">
                                No replies yet
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReplyItem;
