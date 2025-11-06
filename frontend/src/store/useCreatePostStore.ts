import { PostDataForCreate } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PostState {
    postData: PostDataForCreate;
    drafts: PostDataForCreate[];

    setPostData: (data: Partial<PostDataForCreate>) => void;
    resetPostData: () => void;
    saveToDraft: () => void;
    loadDraft: (index: number) => void;
}

const initialState: PostDataForCreate = {
    title: '',
    author: {
        name: 'test',
        avatar: '/test-avatar.png',
    },
    overview: '',
    content: '',
    tags: [],
    createdAt: new Date().toString(),
    likes: 0,
    comments: 0,
    shares: 0,
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
                    postData: initialState,
                })),

            loadDraft: (index) =>
                set((state) => ({
                    postData: state.drafts[index],
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
