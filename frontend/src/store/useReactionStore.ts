import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

interface ReactionState {
    userEmail: string | null;
    reactions: Record<string, ReactionType>;
    setUserEmail: (email: string) => void;
    addReaction: (postId: string, reactionType: ReactionType) => void;
    getUserReaction: (postId: string) => ReactionType | null;
    clearAll: () => void;
}

export const useReactionStore = create<ReactionState>()(
    persist(
        (set, get) => ({
            userEmail: null,
            reactions: {},

            setUserEmail: (email: string) => {
                set({ userEmail: email });
            },

            addReaction: (postId: string, reactionType: ReactionType) => {
                set((state) => ({
                    reactions: {
                        ...state.reactions,
                        [postId]: reactionType,
                    },
                }));
            },

            getUserReaction: (postId: string) => {
                return get().reactions[postId] || null;
            },

            clearAll: () => {
                set({ userEmail: null, reactions: {} });
            },
        }),
        {
            name: 'user-reactions',
        },
    ),
);