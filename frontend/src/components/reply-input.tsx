'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import MessageInput from './ui/message-input-block/message-input-block';

interface ReplyInputProps {
    onSubmit: (text: string) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ReplyInput = ({ onSubmit, onCancel, isSubmitting }: ReplyInputProps) => {
    const [replyText, setReplyText] = useState('');

    const handleSubmit = () => {
        if (!replyText.trim()) return;
        onSubmit(replyText);
        setReplyText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="mt-3 ml-2">
            <div className="flex items-center gap-2">
                <MessageInput
                    handleKeyDown={handleKeyDown}
                    setComment={setReplyText}
                    value={replyText}
                    isSubmitting={isSubmitting}
                    handleSubmit={handleSubmit}
                    className="flex-1"
                />
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onCancel}
                    type="button"
                >
                    Cancel
                </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                Press Enter to send, Escape to cancel
            </p>
        </div>
    );
};

export default ReplyInput;
