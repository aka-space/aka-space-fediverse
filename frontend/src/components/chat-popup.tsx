'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { MessageCircle, Minus, SendHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { sendMessage } from '@/providers/action';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type ChatMessage = {
    id: number;
    text: string;
    role: 'user' | 'model';
};

export default function ChatPopup() {
    const [showIcon, setShowIcon] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isModelThinking, setTransition] = useTransition();

    const bottomRef = useRef<HTMLDivElement>(null); //Ref scroll down

    //Auto scroll
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    useEffect(() => {
        if (isOpen && history.length === 0) {
            const welcomeMessage: ChatMessage = {
                id: Date.now(),
                text: 'Hello, how can I help you today?',
                role: 'model',
            };
            setHistory([welcomeMessage]);
        }
    }, [isOpen, history.length]);

    //check Internet
    const handleSend = () => {
        if (!input.trim()) return;
        const userMessage: ChatMessage = {
            id: Date.now(),
            text: input,
            role: 'user',
        };
        setHistory((prev) => [...prev, userMessage]);
        setInput('');

        if (!navigator.onLine) {
            setHistory((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    role: 'model',
                    text: 'No internet connection!',
                },
            ]);
            return;
        }

        try {
            setTransition(async () => {
                const resMessage = await sendMessage(input, [
                    ...history,
                    userMessage,
                ]);
                if (resMessage) {
                    const chatMessage: ChatMessage = {
                        id: Date.now(),
                        role: 'model',
                        text: resMessage ?? 'No response from server',
                    };
                    setHistory((prev) => [...prev, chatMessage]);
                }
            });
        } catch (error) {
            console.log('error when setTransition', error);
            const chatMessage: ChatMessage = {
                id: Date.now(),
                role: 'model',
                text: 'Please try again!',
            };
            setHistory((prev) => [...prev, chatMessage]);
        }
    };

    return (
        <>
            {showIcon && (
                <Button
                    size="circle"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setShowIcon(false);
                    }}
                    className="fixed bottom-6 right-6 bg-gray-600 text-white p-3 hover:bg-gray-700 transition cursor-pointer"
                >
                    <MessageCircle />
                </Button>
            )}

            {isOpen && (
                <div className="fixed bottom-7 right-6 w-95 h-150 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center bg-gray-400 text-black p-2.5 text-xs">
                        <div className="flex gap-1 items-center font-semibold">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={23}
                                height={23}
                                className="rounded-full"
                            />
                            AKA
                        </div>
                        <Minus
                            className="bg-white p-2 rounded-sm hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                setIsOpen(!isOpen);
                                setShowIcon(true);
                            }}
                        />
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        {history.map((m, idx) => (
                            <div
                                key={idx}
                                className={`mb-3 flex ${
                                    m.role === 'user'
                                        ? 'justify-end pl-15'
                                        : 'justify-start pr-15'
                                }`}
                            >
                                <div
                                    className={`px-3 py-0.5 rounded-2xl ${
                                        m.role === 'user'
                                            ? 'bg-gray-700 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    <div className="prose prose-sm dark:prose-invert">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {m.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Marker to scroll to */}
                        <div ref={bottomRef} />
                    </div>

                    <div className="flex border p-1 m-2 rounded-lg">
                        <input
                            type="text"
                            value={isModelThinking ? 'Thinking...' : input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            disabled={isModelThinking}
                            className={`flex-1 p-1 outline-none text-sm ${
                                isModelThinking
                                    ? 'text-gray-400 italic animate-blink'
                                    : ''
                            }`}
                        />
                        <button
                            className={`rounded-md text-white px-2.5 transition cursor-pointer ${
                                isModelThinking
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-gray-400 hover:bg-gray-500'
                            }`}
                            onClick={handleSend}
                            disabled={isModelThinking || !input.trim()}
                            type="submit"
                        >
                            <SendHorizontal size={13} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
