'use client';

import { PostsFilter } from '@/components/posts-filter';
import { PostCard } from '@/components/post-card';
import { Spinner } from '@/components/ui/spinner';
import { useGetPosts } from '@/hooks/post/use-get-posts';
import { Post } from '@/types';
import { NoPost } from '@/components/no-post';
import { useEffect, useMemo, useRef } from 'react';
import { formatTime } from '@/lib/format';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { usePostsStore } from '@/store/usePostsStore';

export default function Home() {
    const limit = 10;
    const queryClient = useQueryClient();

    const {
        allPosts,
        currentPage,
        hasMore,
        filter,
        setPosts,
        appendPosts,
        setPage,
        setHasMore,
        setFilter,
        reset,
    } = usePostsStore();

    const searchParams = useSearchParams();
    const search = searchParams.get('search') ?? '';

    const offset = currentPage * limit;
    const { data: posts, isPending: loading } = useGetPosts(
        search,
        limit,
        offset,
    );

    const observerTarget = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);

    useEffect(() => {
        if (posts?.data) {
            if (currentPage === 0) {
                setPosts(posts.data);
            } else {
                appendPosts(posts.data);
            }
            setHasMore(posts.hasMore);
            loadingRef.current = false;
        }
    }, [posts, currentPage, setPosts, appendPosts, setHasMore]);

    useEffect(() => {
        reset();
    }, [search, reset]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !loading &&
                    !loadingRef.current &&
                    allPosts.length > 0
                ) {
                    loadingRef.current = true;
                    setPage(currentPage + 1);
                }
            },
            { threshold: 0.1 },
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loading, allPosts.length, currentPage, setPage]);

    const sortedPosts = useMemo(() => {
        if (allPosts.length === 0) return [];

        const postsCopy = [...allPosts];

        if (filter === 'new') {
            return postsCopy.sort(
                (a: Post, b: Post) =>
                    formatTime(a.updated_at) - formatTime(b.updated_at),
            );
        } else if (filter === 'hot') {
            return postsCopy.sort((a: Post, b: Post) => b.view - a.view);
        }

        return postsCopy;
    }, [allPosts, filter]);

    const handleRefresh = async () => {
        await queryClient.invalidateQueries({ queryKey: ['posts'] });
        reset();
        loadingRef.current = false;
    };

    return (
        <div className="w-full flex justify-center mb-6 px-4">
            <div className="flex flex-col gap-6 max-w-4xl w-full">
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <PostsFilter
                            setFilter={(newFilter) =>
                                setFilter(newFilter as 'new' | 'hot')
                            }
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={loading && currentPage === 0}
                            className="hover:bg-gray-200/70"
                        >
                            {loading && currentPage === 0
                                ? 'Refreshing...'
                                : 'Refresh'}
                        </Button>
                    </div>

                    {loading && currentPage === 0 && (
                        <div className="flex justify-center py-4">
                            <Spinner />
                        </div>
                    )}

                    {!loading &&
                        sortedPosts.length === 0 &&
                        currentPage === 0 && <NoPost />}

                    {sortedPosts.map((post: Post) => (
                        <PostCard key={post.id} post={post} />
                    ))}

                    {hasMore && sortedPosts.length > 0 && (
                        <div
                            ref={observerTarget}
                            className="flex justify-center py-4"
                        >
                            {loading && currentPage > 0 && <Spinner />}
                        </div>
                    )}

                    {!hasMore && sortedPosts.length > 0 && (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                            You have reached the end
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
