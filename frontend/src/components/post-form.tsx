import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface PostFormProps {
    postData: {
        title: string;
        overview: string;
        content: string;
    };
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const PostForm = ({ postData, handleChange, handleSubmit }: PostFormProps) => {
    return (
        <div>
            <h1>Create Post</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <Input id="title" name="title" type="text" value={postData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="overview">Overview</label>
                    <Textarea
                        id="overview"
                        name="overview"
                        value={postData.overview}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    <Textarea
                        id="content"
                        name="content"
                        value={postData.content}
                        onChange={handleChange}
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default PostForm;
