import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, MessageCircle, TrendingUp, MoreHorizontal } from 'lucide-react';

type Post = {
    id: number;
    author: {
        name: string;
        avatar: string;
    };
    title: string;
    overview: string;
    content: string;
    createdAt: string;
    tags: string[];
    likes: number;
    comments: number;
    shares: number;
};

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInMinutes = Math.floor(
            (now.getTime() - postDate.getTime()) / (1000 * 60),
        );

        if (diffInMinutes < 60) {
            return `${diffInMinutes} min ago`;
        } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInMinutes / 1440);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    };

    return (
        <Card className="w-full hover:shadow-md transition-shadow gap-0">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={post.author.avatar}
                                alt={post.author.name}
                            />
                            <AvatarFallback className="bg-gray-200">
                                {post.author.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm text-gray-900">
                                {post.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatTimeAgo(post.createdAt)}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-3">
                        {post.overview}
                    </p>
                </div>

                <div className="flex flex-row justify-between">
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{post.shares}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
