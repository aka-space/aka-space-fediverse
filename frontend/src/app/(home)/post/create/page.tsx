'use client';
import dynamic from 'next/dynamic';

const PostForm = dynamic(() => import('@/components/post-form'), {
    ssr: false,
    loading: () => (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
    ),
});

const CreatePostForm = () => {
    return (
        <div className="w-full px-6">
            <div className="max-w-4xl mx-auto w-full">
                <PostForm />
            </div>
        </div>
    );
};

export default CreatePostForm;
