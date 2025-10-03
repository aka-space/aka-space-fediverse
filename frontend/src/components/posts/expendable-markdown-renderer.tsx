import { useMemo, useState } from 'react';
import { MarkdownContent } from './markdown-content';
import { Button } from '../ui/button';

const MARKDOWN_LIMIT = 500;

interface ExpandableMarkdownRendererProps {
    markdown: string;
}

export function ExpandableMarkdownRenderer({
    markdown,
}: ExpandableMarkdownRendererProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const { contentToDisplay, isTooLong } = useMemo(() => {
        const isTooLong = markdown.length > MARKDOWN_LIMIT;

        const contentToDisplay =
            isTooLong && !isExpanded
                ? markdown.substring(0, MARKDOWN_LIMIT)
                : markdown;

        return {
            contentToDisplay: contentToDisplay,
            isTooLong: isTooLong,
        };
    }, [markdown, isExpanded]);

    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded((prev) => !prev);
    };

    return (
        <div>
            <MarkdownContent content={contentToDisplay} />
            {isTooLong && (
                <Button
                    variant="link"
                    size="sm"
                    onClick={toggleExpand}
                    className="p-0 h-auto text-xs text-muted-foreground font-semibold mt-2"
                >
                    {isExpanded ? 'Show less' : 'Show more'}
                </Button>
            )}
        </div>
    );
}
