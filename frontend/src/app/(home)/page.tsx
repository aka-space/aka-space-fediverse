'use client';

import { PostsFilter } from '@/components/posts-filter';
import { PostCard } from '@/components/post-card';
import { Spinner } from '@/components/ui/spinner';
import { useGetPosts } from '@/hooks/use-get-posts';
import { Post } from '@/types';
import { NoPost } from '@/components/no-post';
import { useMemo, useState } from 'react';
import { formatTime } from '@/lib/formatDate';

export default function Home() {
    const { data: posts, isPending: loading } = useGetPosts();
    const [filter, setFilter] = useState<string>('new');
    const sortedPosts = useMemo(() => {
        if (!posts) return [];

        const postsCopy = [...posts];

        if (filter === 'new') {
            return postsCopy.sort(
                (a: Post, b: Post) =>
                    formatTime(a.createdAt) - formatTime(b.createdAt),
            );
        } else if (filter === 'hot') {
            return postsCopy.sort((a: Post, b: Post) => b.likes - a.likes);
        }

        return postsCopy;
    }, [posts, filter]);

    return (
        <div className="w-full flex justify-center mb-6 px-4">
            <div className="flex flex-col gap-6 max-w-4xl w-full">
                <div className="space-y-8">
                    <PostsFilter setFilter={setFilter} />

                    {loading && (
                        <div className="flex justify-center py-4">
                            <Spinner />
                        </div>
                    )}

                    {!posts && !loading && <NoPost />}

                    {sortedPosts.map((post: Post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
}
