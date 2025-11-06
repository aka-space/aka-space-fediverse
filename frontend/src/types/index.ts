export type Post = {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    title: string;
    content: string;
    createdAt: string;
    likes: number;
    comments: number;
    shares: number;
    overview: string;
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
    title: string;
    author: {
        name: string;
        avatar: string;
    };
    overview: string;
    content: string;
    tags: string[];
    createdAt: string;
    likes: number;
    comments: number;
    shares: number;
}