import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Post } from '@/types';
import { formatTimeAgo } from '@/lib/formatDate';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import parse from 'html-react-parser';

interface PostCardProps {
    post: Post;
}

export function DetailPostCard({ post }: PostCardProps) {
    return (
        <Card className="w-full hover:shadow-md transition-shadow gap-0">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 cursor-pointer">
                            <AvatarImage
                                src={post.author.avatar}
                                alt={post.author.name}
                            />
                            <AvatarFallback className="bg-gray-200">
                                {post.author.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm text-gray-900 cursor-pointer hover:underline">
                                {post.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatTimeAgo(post.createdAt)}
                            </p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 cursor-pointer"
                            >
                                <MoreHorizontal className="h-4 w-4 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48 border border-gray-200 dark:border-neutral-700"
                        >
                            <DropdownMenuItem>Save post</DropdownMenuItem>
                            <DropdownMenuItem>Report</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {post.overview}
                    </p>

                    <div
                        className="prose prose-sm max-w-none text-gray-700 
                                   prose-p:my-2 prose-img:rounded-lg prose-img:my-4
                                   prose-headings:font-semibold prose-a:text-blue-600 
                                   prose-a:no-underline hover:prose-a:underline"
                    >
                        {parse(post.content)}
                    </div>
                </div>

                <div className="flex flex-row justify-between">
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1 cursor-pointer hover:underline">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer hover:underline">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
