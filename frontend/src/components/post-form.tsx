import React, { useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { MinimalTiptapEditor } from './ui/minimal-tiptap';

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
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
                                placeholder="Enter your Title..."
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
                                placeholder="Enter your Overview..."
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Content
                            </label>
                            <MinimalTiptapEditor
                                value={postData.content}
                                onChange={(value) =>
                                    handleChange({
                                        target: { name: 'content', value },
                                    } as unknown as React.ChangeEvent<
                                        HTMLInputElement | HTMLTextAreaElement
                                    >)
                                }
                                className="w-full min-h-60"
                                editorContentClassName="p-5"
                                output="html"
                                placeholder="Enter your Content..."
                                autofocus={true}
                                editable={true}
                                editorClassName="focus:outline-hidden"
                            />
                        </div>
                        <div className="flex items-center justify-end gap-6 mt-6 mb-10">
                            <div>
                                <Button
                                    variant="rounded"
                                    size="lg"
                                    className="px-6 rounded-2xl"
                                    disabled
                                >
                                    Save as draft
                                </Button>
                            </div>

                            <div>
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
