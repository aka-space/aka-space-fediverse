'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Comment } from '@/types';
import { useGetComments } from '@/hooks/comment/use-get-comments';
import CommentItem from './comment-item';

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

    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    const allComments = data?.pages?.flatMap((page) => page.data) || [];

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

    if (allComments.length === 0) {
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
                    Comments ({allComments.length})
                </h3>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                {allComments
                    .slice()
                    .reverse()
                    .map((comment: Comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={postId}
                            replyingTo={replyingTo}
                            onReplyClick={handleReplyClick}
                            onCancelReply={handleCancelReply}
                        />
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
