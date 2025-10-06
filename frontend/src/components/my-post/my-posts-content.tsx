'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Archive,
    Edit,
    Eye,
    FileText,
    MessageSquare,
    MoreVertical,
    ThumbsUp,
    Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const POSTS = {
    published: [
        {
            id: 1,
            title: 'How to patch KDE on FreeBSD?',
            excerpt:
                'Mi magna sed nec nisl mattis. Magna cursus tincidunt rhoncus imperdiet fermentum pretium...',
            tags: ['golang', 'linux', 'interface'],
            views: 125,
            comments: 15,
            likes: 155,
            createdAt: '2024-01-15',
        },
        {
            id: 2,
            title: 'What is a difference between Java nad JavaScript?',
            excerpt:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae etiam lectus...',
            tags: ['java', 'javascript', 'wtf'],
            views: 126,
            comments: 15,
            likes: 155,
            createdAt: '2024-01-14',
        },
        {
            id: 3,
            title: 'I want to study Svelte JS Framework. What is the best resourse should I use?',
            excerpt:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat aliquet maecenas...',
            tags: ['svelte', 'javascript', 'recommendation'],
            views: 125,
            comments: 15,
            likes: 155,
            createdAt: '2024-01-12',
        },
    ],
    drafts: [
        {
            id: 4,
            title: 'Understanding React Server Components',
            excerpt:
                'A deep dive into the new React Server Components architecture and how it changes...',
            tags: ['react', 'nextjs', 'rsc'],
            lastEdited: '2024-01-16',
        },
        {
            id: 5,
            title: 'Best practices for TypeScript in 2024',
            excerpt:
                'Exploring the latest TypeScript features and patterns that every developer should know...',
            tags: ['typescript', 'javascript'],
            lastEdited: '2024-01-13',
        },
    ],
    deleted: [
        {
            id: 6,
            title: 'My old tutorial on Angular',
            excerpt: 'This was an old tutorial that is no longer relevant...',
            tags: ['angular', 'tutorial'],
            deletedAt: '2024-01-10',
        },
    ],
};

type PublishedPost = (typeof POSTS.published)[number];
type DraftPost = (typeof POSTS.drafts)[number];
type DeletedPost = (typeof POSTS.deleted)[number];

function PostTags({ tags }: { tags: string[] }) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                    {tag}
                </Badge>
            ))}
        </div>
    );
}

function PublishedPostCard({ post }: { post: PublishedPost }) {
    return (
        <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <Link href={`/post/${post.id}`}>
                                    <h3 className="font-semibold text-lg hover:text-primary cursor-pointer transition-colors">
                                        {post.title}
                                    </h3>
                                </Link>
                                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                        </div>
                        <PostTags tags={post.tags} />
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {post.comments}
                            </span>
                            <span className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                {post.likes}
                            </span>
                            <span className="ml-auto">
                                Published on {post.createdAt}
                            </span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}

function DraftPostCard({ post }: { post: DraftPost }) {
    return (
        <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg cursor-pointer hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <Badge
                                        variant="outline"
                                        className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                                    >
                                        Draft
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                        </div>
                        <PostTags tags={post.tags} />
                        <div className="flex items-center text-sm text-muted-foreground">
                            <span>Last edited on {post.lastEdited}</span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                Continue Editing
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Draft
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}

function DeletedPostCard({ post }: { post: DeletedPost }) {
    return (
        <Card className="opacity-60 hover:opacity-100 transition-opacity">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">
                                        {post.title}
                                    </h3>
                                    <Badge
                                        variant="outline"
                                        className="bg-red-500/10 text-red-600 dark:text-red-400"
                                    >
                                        Deleted
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                        </div>
                        <PostTags tags={post.tags} />
                        <div className="flex items-center text-sm text-muted-foreground">
                            <span>Deleted on {post.deletedAt}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer bg-transparent"
                        >
                            Restore
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                        >
                            Delete Forever
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function MyPostsContent() {
    const [activeTab, setActiveTab] = useState<
        'published' | 'drafts' | 'deleted'
    >('published');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => {
                        setActiveTab(
                            value as 'published' | 'drafts' | 'deleted',
                        );
                    }}
                    className="w-full"
                >
                    <TabsList className="grid w-full max-w-md grid-cols-3 bg-card/70">
                        <TabsTrigger
                            value="published"
                            className="cursor-pointer"
                        >
                            Published ({POSTS.published.length})
                        </TabsTrigger>
                        <TabsTrigger value="drafts" className="cursor-pointer">
                            Drafts ({POSTS.drafts.length})
                        </TabsTrigger>
                        <TabsTrigger value="deleted" className="cursor-pointer">
                            Deleted ({POSTS.deleted.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="published" className="space-y-4 mt-6">
                        {POSTS.published.map((post) => (
                            <PublishedPostCard key={post.id} post={post} />
                        ))}
                        {POSTS.published.length === 0 && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">
                                        No published posts
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Start writing a new post to see it here
                                    </p>
                                    <Button className="cursor-pointer">
                                        Create New Post
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="drafts" className="space-y-4 mt-6">
                        {POSTS.drafts.map((post) => (
                            <DraftPostCard key={post.id} post={post} />
                        ))}
                        {POSTS.drafts.length === 0 && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">
                                        No drafts yet
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Start writing a new post to see it here
                                    </p>
                                    <Button className="cursor-pointer">
                                        Create New Post
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="deleted" className="space-y-4 mt-6">
                        {POSTS.deleted.map((post) => (
                            <DeletedPostCard key={post.id} post={post} />
                        ))}
                        {POSTS.deleted.length === 0 && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Trash2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">
                                        No deleted posts
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Deleted posts will appear here for 30
                                        days before permanent deletion
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
