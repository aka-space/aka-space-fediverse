import { PostDataForCreate } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';

interface PostState {
    postData: PostDataForCreate;
    drafts: PostDataForCreate[];

    setPostData: (data: Partial<PostDataForCreate>) => void;
    resetPostData: () => void;
    saveToDraft: () => void;
    loadDraft: (index: number) => void;
    deleteDraft: (index: number) => void;
}

const initialState: PostDataForCreate = {
    title: '',
    author: {
        name: useAuthStore.getState().authUser?.username || 'testuser',
        email:
            useAuthStore.getState().authUser?.email || 'testuser@example.com',
    },
    content: '',
    tags: [],
    created_at: new Date().toString(),
    updated_at: new Date().toString(),
    reactions: {},
    view: 0,
    slug: '',
};

export const useCreatePostStore = create<PostState>()(
    persist(
        (set) => ({
            postData: initialState,
            drafts: [],

            setPostData: (data) =>
                set((state) => ({
                    postData: { ...state.postData, ...data },
                })),

            resetPostData: () => set({ postData: initialState }),

            saveToDraft: () =>
                set((state) => ({
                    drafts: [...state.drafts, state.postData],
                })),

            loadDraft: (index) =>
                set((state) => ({
                    postData: state.drafts[index],
                })),

            deleteDraft: (index) =>
                set((state) => ({
                    drafts: state.drafts.filter((_, i) => i !== index),
                })),
        }),
        {
            name: 'post-storage',
            partialize: (state) => ({
                drafts: state.drafts,
            }),
        },
    ),
);
