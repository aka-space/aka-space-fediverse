import React from 'react';

function TagList({ tags }: { tags: string[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}
export default TagList;
