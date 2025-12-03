'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Heart,
    MessageCircle,
    MoreHorizontal,
    Trash2,
    Loader2,
    ChevronDown,
} from 'lucide-react';
import { Comment } from '@/types';
import { formatTimeAgo } from '@/lib/format';
import { useGetComments } from '@/hooks/comment/use-get-comments';
import { useGetChildComments } from '@/hooks/comment/use-get-child-comment';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useCreateComment } from '@/hooks/comment/use-create-comment';
import { useCreateReply } from '@/hooks/comment/use-create-reply';
import { useReactComment } from '@/hooks/comment/use-react-comment';
import { useDeleteComment } from '@/hooks/comment/use-delete-comment';
import { useAuthStore } from '@/store/useAuthStore';
import ReplyInput from './reply-input';

interface CommentPostProps {
    postId: string;
}

const CommentPost = ({ postId }: CommentPostProps) => {
    const {
        data,
        isPending: loading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useGetComments({ postId, limit: 10 });

    const { authUser } = useAuthStore();

    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 },
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleReplyClick = (commentId: string) => {
        setReplyingTo(commentId);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
    };

    const CommentItem = ({ comment }: { comment: Comment }) => {
        const [showReplies, setShowReplies] = useState(false);
        const isReplying = replyingTo === comment.id;

        const {
            data: replies,
            isLoading: repliesLoading,
        } = useGetChildComments(comment.id);

        const { mutate: createReply, isPending: isCreatingReply } =
            useCreateReply(comment.id);
        const { mutate: reactComment } = useReactComment(comment.id, postId);

        const handleSubmitReply = (replyText: string) => {
            createReply(
                { content: replyText },
                {
                    onSuccess: () => {
                        setReplyingTo(null);
                        setShowReplies(true);
                    },
                }
            );
        };

        const handleToggleReplies = () => {
            setShowReplies(!showReplies);
        };

        const handleLikeComment = (e: React.MouseEvent) => {
            e.stopPropagation();
            reactComment();
        };

        const replyCount = replies?.length || 0;

        return (
            <div className="relative">
                <div className="flex gap-3 py-4">
                    <div className="relative">
                        <Avatar className="h-10 w-10 relative z-10 cursor-pointer">
                            <AvatarImage
                                src={`/${comment.account.username.toLowerCase()}.png`}
                                alt={comment.account.username}
                            />
                            <AvatarFallback>
                                {comment.account.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex-1">
                        <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-4 py-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:underline">
                                        {comment.account.username}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatTimeAgo(comment.created_at)}
                                    </span>
                                </div>

                                {authUser?.email === comment.account.email && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-neutral-700"
                                            >
                                                <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-40"
                                        >
                                            <DropdownMenuItem
                                                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {comment.content}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-2 ml-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-gray-600 dark:text-gray-400 hover:text-red-500 cursor-pointer"
                                onClick={handleLikeComment}
                            >
                                <Heart className="h-4 w-4 mr-1" />
                                <span className="text-xs">Like</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-gray-600 dark:text-gray-400 hover:text-blue-500 cursor-pointer"
                                onClick={() => handleReplyClick(comment.id)}
                            >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                <span className="text-xs">Reply</span>
                            </Button>

                            {replyCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 text-gray-600 dark:text-gray-400 hover:text-blue-500 cursor-pointer"
                                    onClick={handleToggleReplies}
                                >
                                    <ChevronDown
                                        className={`h-4 w-4 mr-1 transition-transform ${
                                            showReplies ? 'rotate-180' : ''
                                        }`}
                                    />
                                    <span className="text-xs">
                                        {showReplies ? 'Hide' : 'View'} {replyCount}{' '}
                                        {replyCount === 1 ? 'reply' : 'replies'}
                                    </span>
                                </Button>
                            )}
                        </div>

                        {isReplying && (
                            <div className="mt-3">
                                <ReplyInput
                                    onSubmit={handleSubmitReply}
                                    onCancel={handleCancelReply}
                                    isSubmitting={isCreatingReply}
                                />
                            </div>
                        )}

                        {showReplies && (
                            <div className="mt-3 ml-6 space-y-3 border-l-2 border-gray-200 dark:border-neutral-700 pl-4">
                                {repliesLoading ? (
                                    <div className="flex justify-center py-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                                    </div>
                                ) : replies && replies.length > 0 ? (
                                    replies.map((reply: Comment) => (
                                        <ReplyItem key={reply.id} reply={reply} />
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
            </div>
        );
    };

    const ReplyItem = ({ reply }: { reply: Comment }) => {
        const { mutate: reactReply } = useReactComment(reply.id, postId);

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
                            <Heart className="h-3 w-3 mr-1" />
                            <span className="text-xs">Like</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="py-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Loading comments...
                </p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="py-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No comments yet. Be the first to comment!
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Comments ({data.length})
                </h3>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                {allComments
                    .slice()
                    .reverse()
                    .map((comment: Comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
            </div>

            {hasNextPage && (
                <div ref={observerTarget} className="flex justify-center py-4">
                    {isFetchingNextPage && (
                        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                    )}
                </div>
            )}

            {!hasNextPage && allComments.length > 0 && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    No more comments
                </div>
            )}
        </div>
    );
};

export default CommentPost;
