'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreatePostStore } from '@/store/useCreatePostStore';

interface Tag {
    text: string;
    onRemove: () => void;
}

const Tag = ({ text, onRemove }: Tag) => {
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8, y: -10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, y: -10, filter: 'blur(10px)' }}
            transition={{
                duration: 0.4,
                ease: 'circInOut',
                type: 'spring',
            }}
            className="bg-white py-1.5 rounded-sm text-sm flex items-center gap-0.5 shadow-[0_0_10px_rgba(0,0,0,0.2)] backdrop-blur-sm text-black"
        >
            <span className='pl-3'>{text}</span>
            <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
                <Button
                    onClick={onRemove}
                    className="bg-transparent text-[8px] h-fit flex items-center justify-center text-black p-1 hover:text-red-600 hover:bg-white"
                >
                    <X className="w-4 h-4" />
                </Button>
            </motion.div>
        </motion.span>
    );
};

interface InputWithTagsProps {
    placeholder?: string;
    className?: string;
    limit?: number;
}

const InputWithTags = ({
    placeholder,
    className,
    limit = 10,
}: InputWithTagsProps) => {
    const {postData, setPostData} = useCreatePostStore();
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!limit || postData.tags.length < limit) {
                setPostData({ ...postData, tags: [...postData.tags, inputValue.trim()] });
                setInputValue('');
            }
        }
    };

    const removeTag = (indexToRemove: number) => {
        setPostData({ ...postData, tags: postData.tags.filter((_, index) => index !== indexToRemove) });
    };

    return (
        <div className={cn('flex flex-col gap-2 w-full', className)}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            >
                <motion.input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        placeholder || 'Type something and press Enter...'
                    }
                    className="w-full border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 rounded-sm p-2"
                    disabled={limit ? postData.tags.length >= limit : false}
                />
            </motion.div>
            <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                    {postData.tags.map((tag, index) => (
                        <Tag
                            key={index}
                            text={tag}
                            onRemove={() => removeTag(index)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export { InputWithTags };
