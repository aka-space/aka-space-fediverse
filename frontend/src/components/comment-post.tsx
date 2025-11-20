'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Heart,
    MessageCircle,
    MoreHorizontal,
    Send,
    Trash2,
} from 'lucide-react';
import { Comment } from '@/types';
import { formatTimeAgo } from '@/lib/formatDate';
import { useGetComments } from '@/hooks/comment/use-get-comments';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import { useDeleteComment } from '@/hooks/comment/use-delete-comment';
import { useUpdateComment } from '@/hooks/comment/use-update-comment';
import { useCreateComment } from '@/hooks/comment/use-create-comment';
import { Input } from './ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import MessageInput from './ui/message-input-block/message-input-block';
import ReplyInput from './reply-input';

interface CommentPostProps {
    postId: string;
}

const CommentPost = ({ postId }: CommentPostProps) => {
    const { data: comments, isPending: loading } = useGetComments();
    const { mutate: likeComment } = useUpdateComment();
    const { mutate: deleteComment } = useDeleteComment();
    const { mutate: createComment, isPending: isCreatingComment } =
        useCreateComment();
    const { authUser } = useAuthStore();

    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const postComments = comments?.filter(
        (comment: Comment) => comment.postId === postId,
    );

    const topLevelComments = postComments?.filter(
        (comment: Comment) => comment.commentId === null,
    );

    const getReplies = (commentId: string) => {
        return postComments?.filter(
            (comment: Comment) => comment.commentId === commentId,
        );
    };

    const handleDeleteComment = (commentId: string) => {
        if (!commentId) return;

        deleteComment(commentId, {
            onSuccess: () => {
                toast.success('Comment deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete comment');
            },
        });
    };

    const handleReplyClick = (commentId: string) => {
        setReplyingTo(commentId);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
    };

    const handleSubmitReply = (parentCommentId: string, replyText: string) => {
        const newReply = {
            postId: postId,
            commentId: parentCommentId,
            comment: replyText,
            author: {
                name: authUser?.username,
                avatar: `/${authUser?.username}.png`,
            },
            likes: 0,
            createdAt: new Date().toISOString(),
        };

        createComment(newReply, {
            onSuccess: () => {
                toast.success('Reply posted successfully');
                setReplyingTo(null);
            },
            onError: (error) => {
                toast.error('Failed to post reply');
                console.error('Reply error:', error);
            },
        });
    };

    const CommentItem = ({
        comment,
        isReply = false,
    }: {
        comment: Comment;
        isReply?: boolean;
        isLast?: boolean;
    }) => {
        const replies = getReplies(comment.id);
        const isReplying = replyingTo === comment.id;

        const handleLikeComment = (e: React.MouseEvent) => {
            e.stopPropagation();
            likeComment(
                { ...comment, likes: comment.likes + 1 },
                {
                    onSuccess: () => {
                        comment.likes += 1;
                    },
                    onError: (error) => {
                        toast.error(
                            error.message || 'Failed to like the comment.',
                        );
                    },
                },
            );
        };

        return (
            <div className="relative">
                <div className="flex gap-3 py-4">
                    <div className="relative">
                        <Avatar className="h-10 w-10 relative z-10 cursor-pointer">
                            <AvatarImage
                                src={comment.author.avatar}
                                alt={comment.author.name}
                            />
                            <AvatarFallback>
                                {comment.author.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        {replies.length > 0 && !isReply && (
                            <div
                                className={`absolute left-[20px] w-[2px] bg-gray-300 dark:bg-neutral-600`}
                                style={{
                                    top: '40px',
                                    height: `calc(100% - 70px + ${(replies.length - 1) * 100}px)`,
                                }}
                            ></div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-4 py-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:underline">
                                        {comment.author.name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatTimeAgo(comment.createdAt)}
                                    </span>
                                </div>

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
                                            onClick={() =>
                                                handleDeleteComment(comment.id)
                                            }
                                            className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {comment.comment}
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
                                <span className="text-xs">{comment.likes}</span>
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
                        </div>

                        {isReplying && (
                            <ReplyInput
                                onSubmit={(text) =>
                                    handleSubmitReply(comment.id, text)
                                }
                                onCancel={handleCancelReply}
                                isSubmitting={isCreatingComment}
                            />
                        )}

                        {replies.length > 0 && (
                            <div className="mt-2 relative">
                                {replies.map(
                                    (reply: Comment, index: number) => (
                                        <CommentItem
                                            key={`post_${reply.id}`}
                                            comment={reply}
                                            isReply={true}
                                            isLast={
                                                index === replies.length - 1
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (postComments?.length === 0) {
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
            {loading && <p>Loading comments...</p>}
            {comments && (
                <>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Comments ({postComments.length})
                        </h3>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {topLevelComments
                            .slice()
                            .reverse()
                            .map((comment: Comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                />
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CommentPost;
