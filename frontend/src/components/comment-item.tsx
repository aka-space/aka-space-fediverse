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
import { useGetChildComments } from '@/hooks/comment/use-get-child-comment';
import { useCreateReply } from '@/hooks/comment/use-create-reply';
import { useReactComment } from '@/hooks/comment/use-react-comment';
import { useAuthStore } from '@/store/useAuthStore';
import ReplyInput from './reply-input';
import ReplyItem from './reply-item';
import { toast } from 'sonner';

interface CommentItemProps {
    comment: Comment;
    postId: string;
    replyingTo: string | null;
    onReplyClick: (commentId: string) => void;
    onCancelReply: () => void;
}

const CommentItem = ({
    comment,
    postId,
    replyingTo,
    onReplyClick,
    onCancelReply,
}: CommentItemProps) => {
    const [showReplies, setShowReplies] = useState(false);
    const isReplying = replyingTo === comment.id;

    const { data: replies, isLoading: repliesLoading } = useGetChildComments(
        comment.id,
    );
    const { mutate: createReply, isPending: isCreatingReply } = useCreateReply(
        comment.id,
    );
    const { mutate: reactComment } = useReactComment(comment.id, postId);
    const { authUser } = useAuthStore();

    const handleSubmitReply = (replyText: string) => {
        createReply(
            { content: replyText },
            {
                onSuccess: () => {
                    onCancelReply();
                    setShowReplies(true);
                    toast.success('Reply posted successfully');
                },
                onError: () => {
                    toast.error('Failed to post reply');
                },
            },
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
                            src={comment.account.avatar_path || ''}
                            alt={comment.account.username}
                        />
                        <AvatarFallback className="bg-black text-white">
                            {comment.account.username
                                ?.substring(0, 2)
                                .toUpperCase()}
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
                                        <DropdownMenuItem className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer">
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
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span className="text-xs">Like</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-gray-600 dark:text-gray-400 hover:text-blue-500 cursor-pointer"
                            onClick={() => onReplyClick(comment.id)}
                        >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Reply</span>
                        </Button>

                        <div className="flex items-center gap-1">
                            {comment.reactions.like > 0 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    👍{comment.reactions.like}
                                </span>
                            )}
                        </div>
                    </div>

                    {replyCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-gray-600 dark:text-gray-400 hover:text-blue-500 cursor-pointer mt-2.5 ml-2"
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

                    {isReplying && (
                        <div className="mt-3">
                            <ReplyInput
                                onSubmit={handleSubmitReply}
                                onCancel={onCancelReply}
                                isSubmitting={isCreatingReply}
                            />
                        </div>
                    )}

                    {showReplies && (
                        <div className="mt-3 space-y-3 border-l-2 border-gray-200 dark:border-neutral-700 pl-4">
                            {repliesLoading ? (
                                <div className="flex justify-center py-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                                </div>
                            ) : replies && replies.length > 0 ? (
                                replies.map((reply: Comment) => (
                                    <ReplyItem
                                        key={reply.id}
                                        reply={reply}
                                        postId={postId}
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
        </div>
    );
};

export default CommentItem;
