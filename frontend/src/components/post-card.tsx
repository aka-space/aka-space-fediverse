import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Post, Comment } from '@/types';
import { useRouter } from 'next/navigation';
import { formatOverview, formatTimeAgo } from '@/lib/format';
import { ReportModal } from './report-modal';
import { useState, useMemo } from 'react';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const route = useRouter();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const handleNavigate = (slug: string) => {
        route.push(`/post/${slug}`);
    };

    const contentPreview = useMemo(() => {
        const text = post.content.replace(/<[^>]*>/g, '');
        const decoded = text
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
        return decoded.trim();
    }, [post.content]);

    return (
        <>
            <Card className="w-full hover:shadow-md transition-shadow gap-0">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 cursor-pointer">
                                <AvatarImage
                                    src={`/${post.author.username?.toLowerCase()}.png`}
                                    alt={post.author.username}
                                />
                                <AvatarFallback className="bg-gray-200">
                                    {post.author.username
                                        ?.substring(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p
                                    className="font-semibold text-sm text-gray-900 hover:underline cursor-pointer"
                                    onClick={() => {
                                        route.push(
                                            `/?author=${post.author.username}`,
                                        );
                                    }}
                                >
                                    {post.author.username}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatTimeAgo(post.updated_at)}
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
                                <DropdownMenuItem>Hide post</DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setIsReportModalOpen(true)}
                                >
                                    Report
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                    <div
                        onClick={() => handleNavigate(post.slug)}
                        className="cursor-pointer"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {post.title}
                        </h3>

                        <p className="text-sm text-gray-600 line-clamp-3">
                            {formatOverview(contentPreview)}
                        </p>
                    </div>

                    <div className="flex flex-row justify-between">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => {
                                        route.push(`/?tags=${tag}`);
                                    }}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <button className="flex items-center gap-1 hover:text-red-700 transition-colors">
                                <Heart className="h-4 w-4" />
                                <span>{post.view}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors" onClick={() => handleNavigate(post.slug)}>
                                <MessageCircle className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ReportModal
                open={isReportModalOpen}
                onOpenChange={setIsReportModalOpen}
                postId={post.id}
                postTitle={post.title}
            />
        </>
    );
}
