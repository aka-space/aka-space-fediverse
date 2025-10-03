import { Star, LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Sidebar() {
    return (
        <aside className="w-80 space-y-6">
            {/* Must-read posts */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Must-read posts
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <a
                        href="#"
                        className="block text-sm text-primary hover:underline"
                    >
                        • Please read rules before you start working on a
                        platform
                    </a>
                    <a
                        href="#"
                        className="block text-sm text-primary hover:underline"
                    >
                        • Vision & strategy of Akamhao
                    </a>
                </CardContent>
            </Card>

            {/* Featured links */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Featured links
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <a
                        href="#"
                        className="block text-sm text-primary hover:underline"
                    >
                        • Akamhao source-code on GitHub
                    </a>
                    <a
                        href="#"
                        className="block text-sm text-primary hover:underline"
                    >
                        • Golang best-practices
                    </a>
                    <a
                        href="#"
                        className="block text-sm text-primary hover:underline"
                    >
                        • Alem School dashboard
                    </a>
                </CardContent>
            </Card>
        </aside>
    );
}
