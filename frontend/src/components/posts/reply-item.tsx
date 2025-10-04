import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import CommentStats from './comment-stats';
import { Comment } from './post-detail-content';
import { ExpandableMarkdownRenderer } from './expendable-markdown-renderer';

function ReplyItem({ reply }: { reply: Comment }) {
    return (
        <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex gap-3">
                <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage
                        src={reply.author.avatar || '/placeholder.svg'}
                        alt={reply.author.name}
                    />
                    <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors">
                            {reply.author.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {reply.timeAgo}
                        </span>
                    </div>
                    <p className="text-sm text-foreground mb-2 leading-relaxed">
                        <ExpandableMarkdownRenderer markdown={reply.content} />
                    </p>
                    <CommentStats likes={reply.likes} replies={reply.replies} />
                </div>
            </div>
        </div>
    );
}

export default ReplyItem;
