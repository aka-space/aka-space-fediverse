'use client';

import { PostsFilter } from '@/components/posts-filter';
import { PostCard } from '@/components/post-card';
import { Spinner } from '@/components/ui/spinner';
import {
    useQuery,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

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

const queryClient = new QueryClient();

export default function Home() {
    return (
        <QueryClientProvider client={queryClient}>
            <HomeContent />
        </QueryClientProvider>
    );
}

function HomeContent() {
    const { data: posts, isPending: loading } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await fetch(api, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
    });

    return (
        <div className="w-[calc[100%-42rem] flex justify-center mb-6">
            <div className="flex flex-col gap-6 max-w-4xl w-full">
                <div className="space-y-8">
                    <PostsFilter />

                    {posts?.map((post: Post) => (
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
