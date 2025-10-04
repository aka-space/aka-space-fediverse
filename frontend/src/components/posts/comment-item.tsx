'use client';

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import CommentStats from './comment-stats';
import { type Comment } from './post-detail-content';
import ReplyItem from './reply-item';
import { ExpandableMarkdownRenderer } from './expendable-markdown-renderer';

function CommentItem({ comment }: { comment: Comment }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex gap-3 mb-3">
                    <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage
                            src={comment.author.avatar || '/placeholder.svg'}
                            alt={comment.author.name}
                        />
                        <AvatarFallback>
                            {comment.author.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors">
                                {comment.author.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {comment.timeAgo}
                            </span>
                        </div>
                        <p className="text-sm text-foreground mb-2 leading-relaxed">
                            <ExpandableMarkdownRenderer
                                markdown={comment.content}
                            />
                        </p>
                        <CommentStats
                            likes={comment.likes}
                            replies={comment.replies}
                        />
                    </div>
                </div>
                {comment.nested && comment.nested.length > 0 && (
                    <div className="ml-11 space-y-3">
                        {comment.nested.map((reply) => (
                            <ReplyItem key={reply.id} reply={reply} />
                        ))}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground cursor-pointer"
                        >
                            Show more replies
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default CommentItem;
