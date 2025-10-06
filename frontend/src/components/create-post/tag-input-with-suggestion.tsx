import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { ControllerRenderProps } from 'react-hook-form';

const mockTags = [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'CSS',
    'HTML',
    'Web Development',
    'Frontend',
    'Backend',
    'Design',
    'Database',
];

interface TagInputWithSuggestionProps {
    field: ControllerRenderProps<
        {
            title: string;
            content: string;
            tags?: string[] | undefined;
            images?: string[] | undefined;
        },
        'tags'
    >;
}
export function TagInputWithSuggestion({ field }: TagInputWithSuggestionProps) {
    const [tagInput, setTagInput] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const debouncedTagInput = useDebounce(tagInput, 300);

    const containerRef = useRef<HTMLDivElement>(null);

    const filteredTags = mockTags
        .filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase()))
        .slice(0, 5);

    const isMenuVisible =
        debouncedTagInput.length > 0 &&
        filteredTags.length > 0 &&
        isInputFocused;

    const handleAddTag = (tagToAdd: string) => {
        const currentTags = field.value || [];
        if (!currentTags.includes(tagToAdd)) {
            field.onChange([...currentTags, tagToAdd]);
        }
        setTagInput('');
        setIsInputFocused(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            handleAddTag(tagInput.trim());
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsInputFocused(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [containerRef]);

    return (
        <div
            ref={containerRef}
            className="relative w-full flex items-center gap-2"
        >
            <Input
                placeholder="Tag"
                className="w-96"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsInputFocused(true)}
            />

            <span className="text-sm text-muted-foreground mt-1 block">
                (Press Enter to add tag)
            </span>

            {isMenuVisible && (
                <div
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
                    style={{ top: '100%' }}
                >
                    {filteredTags.map((tag) => (
                        <div
                            key={tag}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                            onClick={() => handleAddTag(tag)}
                        >
                            {tag}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
