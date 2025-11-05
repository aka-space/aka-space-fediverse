import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-10 w-10 text-gray-500 animate-spin" />
                <p className="text-gray-600 font-medium">
                    Loading, please wait...
                </p>
            </div>
        </div>
    );
}
