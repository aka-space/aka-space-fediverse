'use client';

import { useState } from 'react';
import { Flame, TrendingUp, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const filters = [
    { id: 'new', label: 'New', icon: Clock },
    { id: 'top', label: 'Top', icon: TrendingUp },
    { id: 'hot', label: 'Hot', icon: Flame },
    { id: 'closed', label: 'Closed', icon: XCircle },
];

export function FilterTabs() {
    const [activeFilter, setActiveFilter] = useState('new');

    return (
        <div className="flex gap-2">
            {filters.map((filter) => {
                const Icon = filter.icon;
                const isActive = activeFilter === filter.id;

                return (
                    <Button
                        key={filter.id}
                        variant={isActive ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveFilter(filter.id)}
                        className="gap-2"
                    >
                        <Icon className="h-4 w-4" />
                        {filter.label}
                    </Button>
                );
            })}
        </div>
    );
}
