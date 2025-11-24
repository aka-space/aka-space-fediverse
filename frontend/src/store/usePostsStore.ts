import { create } from 'zustand';
import { Post } from '@/types';

interface PostsState {
    allPosts: Post[];
    currentPage: number;
    hasMore: boolean;
    filter: 'new' | 'hot';
    
    setPosts: (posts: Post[]) => void;
    appendPosts: (posts: Post[]) => void;
    setPage: (page: number) => void;
    setHasMore: (hasMore: boolean) => void;
    setFilter: (filter: 'new' | 'hot') => void;
    reset: () => void;
}

export const usePostsStore = create<PostsState>((set) => ({
    allPosts: [],
    currentPage: 0,
    hasMore: true,
    filter: 'new' as const,
    
    setPosts: (posts: Post[]) => 
        set({ allPosts: posts }),
    
    appendPosts: (newPosts: Post[]) => 
        set((state) => {
            const existingIds = new Set(state.allPosts.map(p => p.id));
            const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
            return { allPosts: [...state.allPosts, ...uniqueNewPosts] };
        }),
    
    setPage: (page: number) => 
        set({ currentPage: page }),
    
    setHasMore: (hasMore: boolean) => 
        set({ hasMore }),
    
    setFilter: (filter: 'new' | 'hot') => 
        set({ filter }),
    
    reset: () => 
        set({
            currentPage: 0,
            filter: 'new',
        }),
}));