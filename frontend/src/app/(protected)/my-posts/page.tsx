import { MyPostsContent } from '@/components/my-post/my-posts-content';
import React from 'react';

const Page = () => {
    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">My Posts</h1>
                <p className="text-muted-foreground">
                    Manage all your posts, drafts, and deleted content
                </p>
            </div>
            <MyPostsContent />
        </>
    );
};

export default Page;
