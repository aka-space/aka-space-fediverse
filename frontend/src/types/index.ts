export type Post = {
    id: string;
    author: {
        username: string;
        email: string;
    };
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    reactions: Object;
    view: number;
    slug: string;
    tags: string[];
};

export type Comment = {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    postId: string;
    commentId: string | null;
    comment: string;
    createdAt: string;
    likes: number;
};

export type PostDataForCreate = {
    author: {
        name: string;
        email: string;
    };
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    reactions: Object;
    view: number;
    slug: string;
    tags: string[];
};

export type UserLogin = {
    email: string;
    password: string;
};

export type UserRegister = {
    username: string;
    email: string;
    password: string;
};

export interface Emoji {
    emoji: string;
    label: string;
    group?: string;
    skin?: number;
}
