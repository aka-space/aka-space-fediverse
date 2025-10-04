'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, MessageSquare, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import TagList from './tag-list';
import { MarkdownContent } from './markdown-content';

export interface Author {
    name: string;
    avatar: string;
}

export interface Comment {
    id: number;
    author: Author;
    timeAgo: string;
    content: string;
    likes: number;
    replies: number;
    nested?: Comment[];
}

export interface PostDetailContentProps {
    post: {
        author: Author;
        timestamp: string;
        title: string;
        content: string;
        tags: string[];
        likes: number;
        comments: number;
    };
}

export function PostDetailContent({ post }: PostDetailContentProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarImage
                                src={post.author.avatar || '/placeholder.svg'}
                                alt={post.author.name}
                            />
                            <AvatarFallback>
                                {post.author.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors">
                                @{post.author.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {post.timestamp}
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Report</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <h1 className="text-xl font-bold mb-4 text-balance">
                    {post.title}
                </h1>
                <MarkdownContent content={post.content} />
                <div className="flex items-center justify-between mt-4">
                    <TagList tags={post.tags} />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                        <ArrowUp className="h-3 w-3" />
                        <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                        <MessageSquare className="h-3 w-3" />
                        <span>{post.comments}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
