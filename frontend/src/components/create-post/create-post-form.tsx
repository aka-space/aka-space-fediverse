'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import InsertImagesField from './insert-images-field';
import InsertTagsField from './insert-tags-field';

import { Textarea } from '../ui/textarea';
import type { ContentEditorProps } from './content-editor';
const ContentEditor = dynamic<ContentEditorProps>(
    () => import('./content-editor').then((mod) => mod.ContentEditor),
    { ssr: false },
);

const createPostSchema = z.object({
    title: z
        .string()
        .min(2, { message: 'Title must be at least 2 characters.' }),
    content: z
        .string()
        .min(10, { message: 'Content must be at least 10 characters.' }),
    tags: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
});
export type CreatePostFormValues = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
    const form = useForm<CreatePostFormValues>({
        resolver: zodResolver(createPostSchema),
        defaultValues: { title: '', content: '', tags: [], images: [] },
    });

    function onSubmit(data: CreatePostFormValues) {
        console.log(data);
    }

    return (
        <Card>
            <CardTitle className="px-6 text-2xl">Create Post</CardTitle>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Post title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        {/* <Textarea
                                            placeholder="Post content"
                                            className="min-h-[200px]"
                                            {...field}
                                        /> */}
                                        <ContentEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Write your post content here..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <InsertImagesField form={form} />
                        <InsertTagsField form={form} />
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" type="button">
                                Save as Draft
                            </Button>
                            <Button type="submit">Post</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
