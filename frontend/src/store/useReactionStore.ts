import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

interface ReactionState {
    userEmail: string | null;
    reactions: Record<string, Record<string, ReactionType>>;
    setUserEmail: (email: string) => void;
    addReaction: (postSlug: string, reactionType: ReactionType) => void;
    getUserReaction: (postSlug: string) => ReactionType | null;
    clearUserReactions: () => void;
    switchUser: (newEmail: string) => void;
}

export const useReactionStore = create<ReactionState>()(
    persist(
        (set, get) => ({
            userEmail: null,
            reactions: {},

            setUserEmail: (email: string) => {
                const state = get();

                if (state.userEmail && state.userEmail !== email) {
                    set({ userEmail: email });
                } else {
                    set({ userEmail: email });
                }
            },

            addReaction: (postSlug: string, reactionType: ReactionType) => {
                const { userEmail, reactions } = get();

                if (!userEmail) {
                    console.warn('No user email set');
                    return;
                }

                const userReactions = reactions[userEmail] || {};

                set({
                    reactions: {
                        ...reactions,
                        [userEmail]: {
                            ...userReactions,
                            [postSlug]: reactionType,
                        },
                    },
                });
            },

            getUserReaction: (postSlug: string) => {
                const { userEmail, reactions } = get();

                if (!userEmail) return null;

                const userReactions = reactions[userEmail];
                return userReactions?.[postSlug] || null;
            },

            clearUserReactions: () => {
                const { userEmail, reactions } = get();

                if (!userEmail) return;

                const { [userEmail]: _, ...remainingReactions } = reactions;

                set({
                    reactions: remainingReactions,
                });
            },

            switchUser: (newEmail: string) => {
                set({ userEmail: newEmail });
            },
        }),
        {
            name: 'user-reactions',
        },
    ),
);
