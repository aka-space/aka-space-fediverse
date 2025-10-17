'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Minus, SendHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export default function ChatPopup() {
    const [showIcon, setShowIcon] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const bottomRef = useRef<HTMLDivElement>(null); //Ref scroll down

    //Auto scroll
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages((prev) => [...prev, newMsg]);
        setInput('');

        //fake bot reply
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: 'Hello, how can I help?',
                    sender: 'bot',
                },
            ]);
        }, 600);
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
                    className="fixed bottom-6 right-6 bg-gray-600 text-white p-3 hover:bg-gray-700 transition"
                >
                    <MessageCircle />
                </Button>
            )}

            {isOpen && (
                <div className="fixed bottom-7 right-6 w-80 h-[460px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center bg-gray-300 text-black p-1 text-xs">
                        <div className="flex gap-0.5">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={15}
                                height={15}
                                className="rounded-full"
                            />
                            AKA
                        </div>
                        <Minus
                            className="bg-gray-200 p-2 rounded-sm hover:bg-gray-100"
                            onClick={() => {
                                setIsOpen(!isOpen);
                                setShowIcon(true);
                            }}
                        />
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`mb-2 flex ${
                                    m.sender === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`px-3 py-0.5 rounded-2xl ${
                                        m.sender === 'user'
                                            ? 'bg-gray-700 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {/* Marker to scroll to */}
                        <div ref={bottomRef} />
                    </div>

                    <div className="flex border p-0.5 m-1 rounded-lg">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 p-1 outline-none text-sm"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-gray-300 rounded-lg text-white px-2.5 hover:bg-gray-200"
                        >
                            <SendHorizontal size={13} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
