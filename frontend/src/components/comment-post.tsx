'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';
import commentsData from '@/data/comments.json';
import { Comment } from '@/types';
import { formatTimeAgo } from '@/lib/formatDate';

interface CommentPostProps {
    postId: string;
}

const CommentPost = ({ postId }: CommentPostProps) => {
    const postComments = commentsData.filter(
        (comment: Comment) => comment.postId === postId
    );

    const topLevelComments = postComments.filter(
        (comment: Comment) => comment.commentId === null
    );

    const getReplies = (commentId: string) => {
        return postComments.filter(
            (comment: Comment) => comment.commentId === commentId
        );
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean; isLast?: boolean }) => {
        const replies = getReplies(comment.id);

        return (
            <div className="relative">
                {isReply && (
                    <>
                        <div className="absolute left-[-32px] top-[36px] w-[32px] h-[2px] bg-gray-300 dark:bg-neutral-600"></div>
                    </>
                )}

                <div className="flex gap-3 py-4">
                    <div className="relative">
                        <Avatar className="h-10 w-10 relative z-10 cursor-pointer">
                            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                            <AvatarFallback>
                                {comment.author.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        
                        {replies.length > 0 && !isReply && (
                            <div 
                                className="absolute left-[20px] w-[2px] bg-gray-300 dark:bg-neutral-600" 
                                style={{
                                    top: '40px',
                                    height: `calc(100% - 120px + ${(replies.length - 1) * 100}px)`
                                }}
                            ></div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-4 py-2">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:underline">
                                    {comment.author.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTimeAgo(comment.createdAt)}
                                </span>
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
                            >
                                <Heart className="h-4 w-4 mr-1" />
                                <span className="text-xs">{comment.likes}</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-gray-600 dark:text-gray-400 hover:text-blue-500 cursor-pointer"
                            >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                <span className="text-xs">Reply</span>
                            </Button>
                        </div>

                        {replies.length > 0 && (
                            <div className="mt-2 relative">
                                {replies.map((reply, index) => (
                                    <CommentItem 
                                        key={reply.id} 
                                        comment={reply} 
                                        isReply={true} 
                                        isLast={index === replies.length - 1}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (postComments.length === 0) {
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
                    Comments ({postComments.length})
                </h3>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                {topLevelComments.slice().reverse().map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
};

export default CommentPost;
