'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Flame, Clock } from 'lucide-react';
const filters = [
    { id: 'new', label: 'New', icon: Clock },
    { id: 'hot', label: 'Hot', icon: Flame },
];

export function PostsFilter({
    setFilter,
}: {
    setFilter: (filter: string) => void;
}) {
    const [activeFilter, setActiveFilter] = useState<string>('new');

    return (
        <div className="flex gap-2">
            {filters.map(
                (filter: {
                    id: string;
                    label: string;
                    icon: React.ElementType;
                }) => {
                    const Icon = filter.icon;
                    const isActive = activeFilter === filter.id;

                    return (
                        <Button
                            key={filter.id}
                            variant={isActive ? 'default' : 'secondary'}
                            size="sm"
                            onClick={() => {
                                setActiveFilter(filter.id);
                                setFilter(filter.id);
                            }}
                            className="gap-2 rounded-3xl"
                        >
                            <Icon className="h-4 w-4" />
                            {filter.label}
                        </Button>
                    );
                },
            )}
        </div>
    );
}
