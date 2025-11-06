'use client';

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { MinimalTiptapEditor } from './ui/minimal-tiptap';
import { useCreatePostStore } from '@/store/useCreatePostStore';
import { useCreatePost } from '@/hooks/use-create-post';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Content } from '@tiptap/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText } from 'lucide-react';
import { InputWithTags } from './ui/input-with-tags';

const PostForm = () => {
    const router = useRouter();
    const { postData, setPostData, saveToDraft, drafts, loadDraft } =
        useCreatePostStore();
    const [showDrafts, setShowDrafts] = useState(false);
    const [editorKey, setEditorKey] = useState(0);

    const createPost = useCreatePost();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setPostData({ [name]: value });
    };

    const handleEditorChange = (value: Content) => {
        const stringValue = value?.toString();
        setPostData({ content: stringValue });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!postData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (!postData.content.trim()) {
            toast.error('Content is required');
            return;
        }

        createPost.mutate(postData, {
            onSuccess: () => {
                toast.success('Post created successfully!');
                router.push('/');
            },
            onError: (error) => {
                toast.error('Failed to create post: ' + error.message);
            },
        });
    };

    const handleSaveDraft = () => {
        saveToDraft();
        toast.success('Saved to drafts!');
    };

    const handleLoadDraft = (index: number) => {
        loadDraft(index);
        setEditorKey((prev) => prev + 1);
        toast.success('Draft loaded!');
        setShowDrafts(false);
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center py-6 px-4">
            <div className="w-full max-w-4xl bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800">
                <div className="bg-white dark:bg-neutral-800 rounded-md p-6 border border-gray-100 dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            Create Post
                        </h1>

                        {drafts.length > 0 && (
                            <DropdownMenu
                                open={showDrafts}
                                onOpenChange={setShowDrafts}
                            >
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Drafts ({drafts.length})
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-64"
                                >
                                    {drafts.map((draft, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                            onClick={() =>
                                                handleLoadDraft(index)
                                            }
                                            className="flex flex-col items-start gap-1 cursor-pointer"
                                        >
                                            <div className="font-medium truncate w-full">
                                                {draft.title || 'Untitled'}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate w-full">
                                                {draft.overview ||
                                                    'No overview'}
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-4">
                            <label
                                htmlFor="title"
                                className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                                disabled={createPost.isPending}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="overview"
                                className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                                disabled={createPost.isPending}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="content"
                                className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Content
                            </label>
                            <div className="min-h-60">
                                <MinimalTiptapEditor
                                    key={editorKey}
                                    value={postData.content}
                                    onChange={handleEditorChange}
                                    className="w-full min-h-60"
                                    editorContentClassName="p-5"
                                    output="html"
                                    placeholder="Enter your Content..."
                                    autofocus={true}
                                    editable={!createPost.isPending}
                                    editorClassName="focus:outline-hidden"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="tags"
                                className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Tags (comma separated)
                            </label>
                            <InputWithTags className="mt-3" />
                        </div>

                        <div className="flex items-center justify-end gap-4 mt-6 mb-10">
                            <Button
                                type="button"
                                variant="rounded"
                                size="lg"
                                className="px-6 rounded-2xl"
                                onClick={handleSaveDraft}
                                disabled={createPost.isPending}
                            >
                                Save as draft
                            </Button>

                            <Button
                                type="submit"
                                className="px-6 rounded-2xl"
                                variant="default"
                                size="lg"
                                disabled={createPost.isPending}
                            >
                                {createPost.isPending ? 'Posting...' : 'Post'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostForm;
