import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, MoreHorizontal } from 'lucide-react';
import { Comment, Post } from '@/types';
import { formatTimeAgo } from '@/lib/format';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useMemo, useState, useEffect } from 'react';
import { ReportModal } from './report-modal';
import { useGetComments } from '@/hooks/comment/use-get-comments';
import { PostReactions } from './post-reactions';
import { useAddReactionPost } from '@/hooks/post/use-add-reaction-post';
import { useAuthStore } from '@/store/useAuthStore';
import { useReactionStore } from '@/store/useReactionStore';
import { ReactionType } from './reaction-picker';
import { useRouter } from 'next/navigation';

interface PostCardProps {
    post: Post;
}

export function DetailPostCard({ post }: PostCardProps) {
    const router = useRouter();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const { mutate: addReaction, isPending: isReacting } = useAddReactionPost();
    const user = useAuthStore((s) => s.authUser);

    const {
        userEmail,
        setUserEmail,
        addReaction: addReactionToStore,
        getUserReaction,
        switchUser,
    } = useReactionStore();

    useEffect(() => {
        if (user?.email) {
            if (userEmail && userEmail !== user.email) {
                switchUser(user.email);
            } else if (!userEmail) {
                setUserEmail(user.email);
            }
        }
    }, [user, userEmail, setUserEmail, switchUser]);

    const userReaction = getUserReaction(post.slug);

    const totalReactions = useMemo(() => {
        if (!post.reactions || typeof post.reactions !== 'object') return 0;
        return Object.values(post.reactions).reduce(
            (sum, count) => sum + count,
            0,
        );
    }, [post.reactions]);

    const [reactionCount, setReactionCount] = useState(totalReactions);

    useEffect(() => {
        setReactionCount(totalReactions);
    }, [totalReactions]);

    const reactionBreakdown = useMemo(() => {
        if (!post.reactions || typeof post.reactions !== 'object') return {};
        return post.reactions as Record<string, number>;
    }, [post.reactions]);

    const handleReactionSelect = (reactionType: ReactionType) => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (isReacting) return;

        const previousReaction = userReaction;

        if (!previousReaction) {
            setReactionCount((prev: number) => prev + 1);
        }

        addReactionToStore(post.slug, reactionType);

        addReaction(
            { data: post, kind: reactionType },
            {
                onError: () => {
                    if (!previousReaction) {
                        setReactionCount((prev: number) => prev - 1);
                    }
                },
            },
        );
    };

    return (
        <>
            <Card className="w-full hover:shadow-md transition-shadow gap-0">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 cursor-pointer">
                                <AvatarImage
                                    src={post.author.avatar_path || undefined}
                                    alt={post.author.username}
                                />
                                <AvatarFallback className="bg-black text-white">
                                    {post.author.username
                                        ?.substring(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:underline">
                                    {post.author.username}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTimeAgo(post.created_at)}
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
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {post.title}
                        </h3>

                        <div
                            className="post-content prose prose-sm max-w-none text-gray-700 dark:text-gray-300
                                   prose-p:my-3 prose-p:leading-relaxed
                                   prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                                   prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-4
                                   prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-3
                                   prose-a:text-blue-600 dark:prose-a:text-blue-400
                                   prose-a:no-underline hover:prose-a:underline
                                   prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                                   prose-code:before:content-none prose-code:after:content-none
                                   prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                                   prose-code:text-pink-600 dark:prose-code:text-pink-400
                                   prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                                   prose-code:text-sm prose-code:font-mono
                                   prose-pre:bg-[#1e1e1e] dark:prose-pre:bg-[#0d0d0d]
                                   prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg
                                   prose-pre:overflow-x-auto prose-pre:my-4
                                   prose-pre:border prose-pre:border-gray-700
                                   prose-ul:my-3 prose-ul:list-disc prose-ul:pl-6
                                   prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-6
                                   prose-li:my-1
                                   prose-blockquote:border-l-4 prose-blockquote:border-blue-500
                                   prose-blockquote:pl-4 prose-blockquote:italic
                                   prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
                                   prose-img:rounded-lg prose-img:my-6 prose-img:shadow-md"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    <div className="flex flex-row justify-between items-center pt-4 border-t border-gray-200 dark:border-neutral-700">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <PostReactions
                                reactionCount={reactionCount}
                                reactionBreakdown={reactionBreakdown}
                                userReaction={userReaction}
                                isReacting={isReacting}
                                onReactionSelect={handleReactionSelect}
                            />

                            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
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
