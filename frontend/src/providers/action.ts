'use server';
import { ChatMessage } from '@/components/chat-popup';
import { GoogleGenAI } from '@google/genai';
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function sendMessage(input: string, history: ChatMessage[] = []) {
    const message: ChatMessage[] = [
        ...history.map((msg: ChatMessage) => ({
            id: msg.id,
            role: msg.role,
            text: msg.text,
        })),
        {
            id: Date.now(),
            role: 'user',
            text: input,
        },
    ];

    const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
    });
    return res.text;
}
