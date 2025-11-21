'use client';

import CommentInput from '@/components/comment-input';
import CommentPost from '@/components/comment-post';
import { DetailPostCard } from '@/components/detail-post-card';
import { NoPost } from '@/components/no-post';
import { Spinner } from '@/components/ui/spinner';
import { useGetDetailPost } from '@/hooks/post/use-get-detail-post';
import { Post } from '@/types';
import { useParams } from 'next/navigation';

export default function DetailPostPage() {
    const { id } = useParams();
    const { data: post, isPending: loading } = useGetDetailPost(id as string);

    return (
        <div className="w-full flex justify-center mb-6 px-4">
            <div className="flex flex-col gap-6 max-w-4xl w-full">
                <div className="space-y-8">
                    {loading && (
                        <div className="flex justify-center py-4">
                            <Spinner />
                        </div>
                    )}

                    {!post && !loading && <NoPost />}

                    {post && <DetailPostCard post={post as Post} />}

                    {post && (
                        <>
                            <CommentInput postId={post.id} />
                            <CommentPost postId={post.id} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
