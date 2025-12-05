'use client';

import { useMemo } from 'react';
import { ReactionPicker, ReactionType, REACTIONS } from './reaction-picker';

interface PostReactionsProps {
    reactionCount: number;
    reactionBreakdown: Record<string, number>;
    userReaction: ReactionType | null;
    isReacting: boolean;
    onReactionSelect: (reactionType: ReactionType) => void;
}

export function PostReactions({
    reactionCount,
    reactionBreakdown,
    userReaction,
    isReacting,
    onReactionSelect,
}: PostReactionsProps) {
    const topReactions = useMemo(() => {
        return Object.entries(reactionBreakdown)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([type]) => REACTIONS.find((r) => r.type === type))
            .filter(Boolean);
    }, [reactionBreakdown]);

    return (
        <div className="flex items-center gap-2 group relative">
            {reactionCount > 0 && (
                <div className="flex items-center gap-1">
                    {topReactions.length > 0 && (
                        <div className="flex -space-x-1">
                            {topReactions.map((reaction, idx) => (
                                <span key={idx} className="text-xs">
                                    {reaction?.emoji}
                                </span>
                            ))}
                        </div>
                    )}
                    <span className="text-sm hover:underline cursor-pointer">
                        {reactionCount}
                    </span>
                </div>
            )}

            <div className="relative">
                <ReactionPicker
                    currentReaction={userReaction}
                    onReactionSelect={onReactionSelect}
                    disabled={isReacting}
                />
            </div>
        </div>
    );
}
