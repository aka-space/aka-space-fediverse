'use client';

import { Send, Smile } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import { Emoji } from '@/types';

function EmojiPickerPopover({
    onSelect,
}: {
    onSelect: (emoji: Emoji) => void;
}) {
    const [mod, setMod] = useState<typeof import('frimousse') | null>(null);
    useEffect(() => {
        let mounted = true;
        import('frimousse').then((m) => {
            if (mounted) setMod(m);
        });
        return () => {
            mounted = false;
        };
    }, []);
    if (!mod)
        return (
            <div className="p-4">
                <Spinner />
            </div>
        );
    const EmojiPicker = mod.EmojiPicker;
    return (
        <div className="w-80 max-w-[95vw] rounded-ele border bg-background p-3 shadow-lg">
            <EmojiPicker.Root onEmojiSelect={onSelect}>
                <EmojiPicker.Search className="mb-2 w-full rounded-ele border bg-accent px-2 py-1 text-sm" />
                <EmojiPicker.Viewport className="h-64 w-full overflow-y-auto rounded-md border bg-card">
                    <EmojiPicker.Loading>
                        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                            <Spinner />
                        </div>
                    </EmojiPicker.Loading>
                    <EmojiPicker.Empty>
                        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                            No emoji found.
                        </div>
                    </EmojiPicker.Empty>
                    <EmojiPicker.List
                        className="select-none pb-1.5"
                        components={{
                            CategoryHeader: ({ category, ...props }) => (
                                <div
                                    className="sticky top-0 z-10 bg-background px-3 pt-3 pb-1.5 font-medium text-muted-foreground text-xs"
                                    {...props}
                                >
                                    {category.label}
                                </div>
                            ),
                            Row: ({ children, ...props }) => (
                                <div
                                    className="flex scroll-my-1.5 gap-1 px-1.5"
                                    {...props}
                                >
                                    {children}
                                </div>
                            ),
                            Emoji: ({ emoji, ...props }) => (
                                <button
                                    className="flex size-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-accent focus:bg-accent"
                                    {...props}
                                >
                                    {emoji.emoji}
                                </button>
                            ),
                        }}
                    />
                </EmojiPicker.Viewport>
            </EmojiPicker.Root>
        </div>
    );
}

// function GifPickerPopover({ onSelect }: { onSelect: (url: string) => void }) {
//     const [search, setSearch] = useState('');
//     const [gifs, setGifs] = useState<any[]>([]);
//     const [loading, setLoading] = useState(false);
//     const API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

//     useEffect(() => {
//         if (!API_KEY) return;
//         setLoading(true);
//         const endpoint = search
//             ? `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(search)}&limit=16&rating=pg`
//             : `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=16&rating=pg`;
//         fetch(endpoint)
//             .then((res) => res.json())
//             .then((data) => setGifs(data.data || []))
//             .finally(() => setLoading(false));
//     }, [search, API_KEY]);

//     return (
//         <div className="w-72 max-w-[95vw] p-2">
//             <Input
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search GIFs..."
//                 type="text"
//                 value={search}
//             />
//             <div className="grid grid-cols-4 gap-2 pt-2">
//                 {API_KEY ? (
//                     loading ? (
//                         Array.from({ length: 8 }).map((_, i) => (
//                             <Skeleton className="h-20 w-full" key={i} />
//                         ))
//                     ) : gifs.length === 0 ? (
//                         <div className="col-span-4 text-center text-muted-foreground text-sm">
//                             No GIFs found.
//                         </div>
//                     ) : (
//                         gifs.map((gif) => (
//                             <button
//                                 className="overflow-hidden rounded-ele focus:outline-none focus:ring-2 focus:ring-primary"
//                                 key={gif.id}
//                                 onClick={() =>
//                                     onSelect(gif.images.fixed_height.url)
//                                 }
//                                 type="button"
//                             >
//                                 <img
//                                     alt={gif.title}
//                                     className="h-full w-full object-cover"
//                                     loading="lazy"
//                                     src={gif.images.fixed_height_small.url}
//                                 />
//                             </button>
//                         ))
//                     )
//                 ) : (
//                     <div className="col-span-4 text-center text-muted-foreground text-sm">
//                         Configure NEXT_PUBLIC_GIPHY_API_KEY to enable GIFs.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

export default function MessageInput({
    className,
    isSubmitting,
    handleKeyDown,
    handleSubmit,
    setComment,
    value,
}: {
    className?: string;
    isSubmitting?: boolean;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleSubmit: () => void;
    setComment: (input: string) => void;
    value: string;
}) {
    const [message, setMessage] = useState(value || '');
    const [showEmoji, setShowEmoji] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleEmojiSelect = (emoji: Emoji) => {
        const newMessage = message + (emoji.emoji || '');
        setMessage(newMessage);
        setComment(newMessage);
        textareaRef.current?.focus();
    };

    const handleSend = () => {
        if (!message.trim()) return;
        setMessage('');
    };

    return (
        <div
            className={cn(
                'mx-auto flex w-full flex-col items-center gap-2 sm:px-0',
                className,
            )}
        >
            <Card className="w-full bg-background p-0 shadow-none">
                <CardContent className="p-2 sm:p-3">
                    <form className="flex w-full flex-col gap-2">
                        <Textarea
                            aria-label="Message"
                            className="min-h-[37px] w-full resize-none border-none px-2 text-base shadow-none outline-none ring-0 hover:border-none hover:shadow-none hover:outline-none hover:ring-0 focus:border-none focus:shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-sm"
                            onChange={(e) => {
                                setMessage(e.target.value);
                                setComment(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                const isMac = navigator.platform
                                    .toUpperCase()
                                    .includes('MAC');
                                const submitCombo = isMac
                                    ? e.metaKey
                                    : e.ctrlKey;
                                if (e.key === 'Enter' && submitCombo) {
                                    e.preventDefault();
                                    handleSend();
                                    handleKeyDown(e);
                                }
                            }}
                            placeholder="Type your message..."
                            ref={textareaRef}
                            rows={1}
                            value={message}
                        />
                        <div className="flex flex-row items-center justify-between gap-2 sm:justify-end">
                            <div className="flex items-center gap-1">
                                <DropdownMenu
                                    onOpenChange={setShowEmoji}
                                    open={showEmoji}
                                >
                                    <DropdownMenuTrigger asChild>
                                        <Toggle
                                            aria-label="Add emoji"
                                            size="sm"
                                            type="button"
                                            variant="default"
                                        >
                                            <Smile
                                                aria-hidden="true"
                                                className="size-4"
                                                focusable="false"
                                            />
                                        </Toggle>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-fit min-w-[180px] max-w-[95vw] rounded-card p-0">
                                        <EmojiPickerPopover
                                            onSelect={handleEmojiSelect}
                                        />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <Button
                                aria-label="Send message"
                                className="shrink-0"
                                disabled={!message.trim() || isSubmitting}
                                onClick={() => {
                                    handleSend();
                                    handleSubmit();
                                }}
                                size="icon"
                            >
                                <Send
                                    aria-hidden="true"
                                    className="size-4"
                                    focusable="false"
                                />
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
