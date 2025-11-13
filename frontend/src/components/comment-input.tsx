import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { Spinner } from './ui/spinner';

const CommentInput = () => {
    const [comment, setComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const placeholder = 'Write a comment...';

    const handleSubmit = async () => {
        if (!comment.trim()) return;

        setIsSubmitting(true);
        try {
            console.log('Submitting comment:', comment);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            setComment('');
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
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="min-h-[80px] resize-none focus-visible:ring-1"
                    disabled={isSubmitting}
                />

                <div className="flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={!comment.trim() || isSubmitting}
                        size="sm"
                        className="gap-2 min-w-[120px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner className="h-4 w-4" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                <span>Comment</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CommentInput;
