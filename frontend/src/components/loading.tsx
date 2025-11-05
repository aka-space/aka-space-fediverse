import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-opacity-10">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-10 w-10 text-gray-50 animate-spin" />
            </div>
        </div>
    );
}
