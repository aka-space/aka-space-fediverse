import React from 'react';
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
                                id="content"
                                name="content"
                                value={postData.content}
                                onChange={handleChange}
                                className="w-full min-h-[220px] resize-vertical border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 rounded-sm"
                            />
                        </div>
                        <div className="flex items-center gap-6 mt-6 mb-10">
                            <div className="flex-1 ml-3">
                                <FileUpload  />
                            </div>

                            <div className="flex-2" />

                            <div className="flex-2">
                                <Button
                                    variant="rounded"
                                    size="lg"
                                    className="px-8 rounded-2xl"
                                    disabled
                                >
                                    Save as draft
                                </Button>
                            </div>

                            <div className='flex-2'>
                                <Button
                                    type="submit"
                                    className="px-8 rounded-2xl"
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
