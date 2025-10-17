'use client';
import PostForm from '@/components/post-form';
import React, { useState } from 'react';

interface PostFormProps {
    title: string;
    overview: string;
    content: string;
}

const CreatePostForm = () => {
    const [postData, setPostData] = useState<PostFormProps>({
        title: '',
        overview: '',
        content: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setPostData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Post Data:', postData);
    };
    return (
        <div className="w-full px-6 mt-10">
            <div className="max-w-4xl mx-auto w-full">
                <PostForm
                    postData={postData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default CreatePostForm;
