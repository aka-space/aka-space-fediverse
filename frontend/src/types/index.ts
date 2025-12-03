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
    reactions: object;
    view: number;
    slug: string;
    tags: string[];
};

export type CommentAuthor = {
    email: string;
    username: string;
};

export type Comment = {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
    account: CommentAuthor;
    postId?: string;
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
    reactions: object;
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

export interface CommentResponse {
    data: Comment[];
    next_cursor: string | null;
}

export interface ChildCommentResponse {
    data: Comment[];
    next_cursor: string | null;
}
