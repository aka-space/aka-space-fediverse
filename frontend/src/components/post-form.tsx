import React, { useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { FileUpload } from './ui/file-upload';
import { BookImage } from 'lucide-react';

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
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const handleAddImage = (imageUrl: string) => {
        if (!contentRef.current) return;
        const textarea = contentRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = postData.content.slice(0, start);
        const after = postData.content.slice(end);
        const markdown = `![image](${imageUrl})`;
        const newContent = before + markdown + after;

        handleChange({
            target: {
                name: 'content',
                value: newContent,
            },
        } as React.ChangeEvent<HTMLTextAreaElement>);

        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd =
                start + markdown.length;
        }, 0);
    };

    const handleFileUpload = (files: File[]) => {
        const uploadedImageUrl = URL.createObjectURL(files[0]);
        handleAddImage(uploadedImageUrl);
    };

    return (
        <div className="mmax-w-4xl mx-auto mt-8 p-4 bg-transparent">
            <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800">
                <div className="bg-white dark:bg-neutral-800 rounded-md p-6 border border-gray-100 dark:border-neutral-700">
                    <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        Create Post
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-2">
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Title
                            </label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                value={postData.title}
                                onChange={handleChange}
                                className="w-full border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 rounded-sm"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="overview"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Overview
                            </label>
                            <Textarea
                                id="overview"
                                name="overview"
                                value={postData.overview}
                                onChange={handleChange}
                                className="w-full min-h-[84px] resize-vertical border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 rounded-sm"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Content
                            </label>
                            <Textarea
                                ref={contentRef}
                                id="content"
                                name="content"
                                value={postData.content}
                                onChange={handleChange}
                                className="w-full min-h-[220px] resize-vertical border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 rounded-sm"
                            />
                        </div>
                        <div className="flex items-center gap-6 mt-6 mb-10">
                            <div className="flex-3 ml-10">
                                <FileUpload onChange={handleFileUpload} />
                            </div>

                            <div className="flex-1" />

                            <div className="flex-1">
                                <Button
                                    variant="rounded"
                                    size="lg"
                                    className="px-6 rounded-2xl"
                                    disabled
                                >
                                    Save as draft
                                </Button>
                            </div>

                            <div className="flex-1">
                                <Button
                                    type="submit"
                                    className="px-6 rounded-2xl"
                                    variant="default"
                                    size="lg"
                                >
                                    Post
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostForm;
