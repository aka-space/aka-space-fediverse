'use client';

import { PostsFilter } from '@/components/posts-filter';
import { PostCard } from '@/components/post-card';
import { Spinner } from '@/components/ui/spinner';
import 

type Post = {
    id: number;
    author: {
        name: string;
        avatar: string;
    };
    title: string;
    content: string;
    createdAt: string;
    likes: number;
    comments: number;
    shares: number;
    overview: string;
    tags: string[];
};
const api = 'https://68765855814c0dfa653bba48.mockapi.io/mockTest';

export default function Home() {
    

    return (
        <div className="w-[calc[100%-42rem] flex justify-center mb-6">
            <div className="flex flex-col gap-6 max-w-4xl w-full">
                <div className="space-y-8">
                    <PostsFilter />

                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}

                    {loading && (
                        <div className="flex justify-center py-4">
                            <Spinner />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
