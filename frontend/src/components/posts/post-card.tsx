'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUp, Eye, MessageSquare, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ExpandableMarkdownRenderer } from './expendable-markdown-renderer';
import TagList from './tag-list';

interface Author {
    name: string;
    avatar: string;
}

interface Post {
    id: number;
    author: Author;
    createdAt: string;
    title: string;
    content: string;
    tags: string[];
    views: number;
    comments: number;
    likes: number;
}

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const router = useRouter();

    const handleCardClick = () => router.push(`/posts/${post.id}`);

    return (
        <Card
            className="hover:shadow-md transition-shadow max-w-4xl dark:bg-gray-900"
            onClick={handleCardClick}
        >
            <CardContent className="px-6">
                <div className="flex gap-4">
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage
                            src={post.author.avatar || '/placeholder.svg'}
                            alt={post.author.name}
                        />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">
                                    {post.author.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(
                                        new Date(post.createdAt || Date.now()),
                                        { addSuffix: true },
                                    )}
                                </span>
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
                                    <DropdownMenuItem>Hide</DropdownMenuItem>
                                    <DropdownMenuItem>Share</DropdownMenuItem>
                                    <DropdownMenuItem>Report</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <h3 className="font-semibold text-base mb-2 text-balance">
                            {post.title}
                        </h3>
                        <ExpandableMarkdownRenderer markdown={post.content} />
                        <div className="mb-3" />
                        <TagList tags={post.tags} />
                        <div className="flex items-center gap-4 text-xs mt-4 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4 hover:text-primary" />
                                <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MessageSquare className="h-4 w-4 hover:text-primary" />
                                <span>{post.comments}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <ArrowUp className="h-4 w-4 hover:text-primary" />
                                <span>{post.likes}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
