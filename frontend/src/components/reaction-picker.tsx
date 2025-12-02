'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

interface Reaction {
    type: ReactionType;
    emoji: string;
    label: string;
    color: string;
}

export const REACTIONS: Reaction[] = [
    { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-500' },
    { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-500' },
    { type: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
    { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-orange-500' },
    { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-blue-400' },
    { type: 'angry', emoji: '😡', label: 'Angry', color: 'text-red-600' },
];

interface ReactionPickerProps {
    currentReaction?: ReactionType | null;
    onReactionSelect: (reaction: ReactionType) => void;
    disabled?: boolean;
}

export function ReactionPicker({
    currentReaction,
    onReactionSelect,
    disabled = false,
}: ReactionPickerProps) {
    const [showPicker, setShowPicker] = useState(false);

    const handleReactionClick = (reactionType: ReactionType) => {
        if (disabled) return;
        onReactionSelect(reactionType);
        setShowPicker(false);
    };

    const currentReactionData = REACTIONS.find(
        (r) => r.type === currentReaction,
    );

    return (
        <div
            className="relative"
            onMouseEnter={() => !disabled && setShowPicker(true)}
            onMouseLeave={() => setShowPicker(false)}
        >
            <button
                onClick={() => {
                    if (disabled) return;
                    if (!currentReaction) {
                        onReactionSelect('like');
                    }
                }}
                disabled={disabled}
                className={cn(
                    'flex items-center gap-1 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed',
                    currentReaction
                        ? currentReactionData?.color
                        : 'text-gray-500 hover:text-blue-500',
                )}
            >
                <span className="text-lg">
                    {currentReaction ? currentReactionData?.emoji : <Heart className="h-4 w-4"/>}
                </span>
            </button>

            <AnimatePresence>
                {showPicker && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-neutral-800 rounded-full shadow-lg border border-gray-200 dark:border-neutral-700 px-3 py-2 flex gap-2 z-50"
                    >
                        {REACTIONS.map((reaction) => (
                            <motion.button
                                key={reaction.type}
                                onClick={() => handleReactionClick(reaction.type)}
                                whileHover={{ scale: 1.3, y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    'text-2xl cursor-pointer transition-transform relative group',
                                    currentReaction === reaction.type &&
                                        'scale-125 ring-2 ring-offset-2 ring-blue-400 rounded-full',
                                )}
                                title={reaction.label}
                            >
                                {reaction.emoji}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}