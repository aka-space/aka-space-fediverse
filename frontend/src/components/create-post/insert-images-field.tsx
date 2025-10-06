'use client';

import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

import { UseFormReturn } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { CreatePostFormValues } from './create-post-form';
import { Input } from '../ui/input';

interface InsertTagsFieldProps {
    form: UseFormReturn<CreatePostFormValues, unknown, CreatePostFormValues>;
}
const InsertImagesField = ({ form }: InsertTagsFieldProps) => {
    const handleImageRemove = (index: number, images: string[]) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        form.setValue('images', updatedImages);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const imageUrls = Array.from(files).map((file) =>
            URL.createObjectURL(file),
        );
        form.setValue('images', [
            ...(form.getValues('images') || []),
            ...imageUrls,
        ]);
        e.target.value = '';
    };

    return (
        <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Images</FormLabel>
                    <div className="flex flex-wrap">
                        {field.value?.map((img, idx) => (
                            <div
                                key={idx}
                                className="relative w-24 h-24 mr-2 mb-2"
                            >
                                <Image
                                    src={img}
                                    alt={`Uploaded ${idx + 1}`}
                                    className="w-full h-full object-cover rounded"
                                    fill
                                />
                                <button
                                    className="absolute top-1 right-1 p-0 rounded-full bg-destructive text-white w-5 h-5 flex items-center justify-center text-sm hover:opacity-80 transition-opacity"
                                    type="button"
                                    onClick={() =>
                                        handleImageRemove(
                                            idx,
                                            field.value || [],
                                        )
                                    }
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        You can upload multiple images.
                    </div>
                    <FormControl>
                        <Input
                            id="post-picture"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default InsertImagesField;
