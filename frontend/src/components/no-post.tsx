import React from 'react';
import { FileQuestion } from 'lucide-react';

export function NoPost() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <FileQuestion className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Posts Found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                Something went wrong! Try again or check back later.
            </p>
        </div>
    );
}
