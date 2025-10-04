import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthorSidebarProps {
    author: {
        name: string;
        username: string;
        avatar: string;
        reputation: number;
        badges: number;
        socialLinks: {
            github: string;
            instagram: string;
            facebook: string;
        };
    };
}

export function AuthorSidebar({ author }: AuthorSidebarProps) {
    return (
        <div className="w-80 shrink-0 hidden lg:block">
            <Card className="sticky top-6">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                        {/* Large Avatar */}
                        <Avatar className="h-32 w-32 mb-4">
                            <AvatarImage
                                src={author.avatar || '/placeholder.svg'}
                                alt={author.name}
                            />
                            <AvatarFallback className="text-3xl">
                                {author.name[0]}
                            </AvatarFallback>
                        </Avatar>

                        {/* Username */}
                        <h3 className="font-semibold text-lg mb-3">
                            {author.username}
                        </h3>

                        {/* Reputation Stats */}
                        <div className="flex items-center gap-2 text-orange-500 mb-4">
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-semibold text-xl">
                                {author.reputation} [{author.badges}]
                            </span>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                asChild
                            >
                                <a
                                    href={author.socialLinks.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github className="h-4 w-4" />
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                asChild
                            >
                                <a
                                    href={author.socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Instagram className="h-4 w-4" />
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                asChild
                            >
                                <a
                                    href={author.socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Facebook className="h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
