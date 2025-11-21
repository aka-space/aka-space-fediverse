import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { Spinner } from './ui/spinner';
import { useCreateComment } from '@/hooks/comment/use-create-comment';
import { useAuthStore } from '@/store/useAuthStore';
import MessageInput from './ui/message-input-block/message-input-block';

const CommentInput = ({ postId }: { postId: string }) => {
    const { authUser } = useAuthStore();
    const { mutate: createComment } = useCreateComment();

    const [comment, setComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!comment.trim()) return;

        setIsSubmitting(true);
        try {
            const data = {
                comment: comment.trim(),
                author: {
                    name: authUser?.username,
                    avatar: `${authUser?.username}.png`,
                },
                postId: postId,
                commentId: null,
                createdAt: new Date().toISOString(),
                likes: 0,
            };

            createComment(data, {
                onSuccess: () => {
                    setComment('');
                },
                onError: (error) => {
                    console.error('Error submitting comment:', error);
                },
                onSettled: () => {
                    setIsSubmitting(false);
                },
            });
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex gap-3 py-4">
            <Avatar className="h-10 w-10">
                <AvatarImage
                    src="https://i.pravatar.cc/150?img=11"
                    alt="Your avatar"
                />
                <AvatarFallback className="bg-gray-200">ME</AvatarFallback>
            </Avatar>

            <div className="flex-1 flex flex-col gap-2">
                <MessageInput
                    isSubmitting={isSubmitting}
                    handleKeyDown={handleKeyDown}
                    handleSubmit={handleSubmit}
                    setComment={setComment}
                    value={comment}
                />
            </div>
        </div>
    );
};

export default CommentInput;
