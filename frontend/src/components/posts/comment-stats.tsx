import { ArrowUp, MessageSquare } from 'lucide-react';

function CommentStats({ likes, replies }: { likes: number; replies: number }) {
    return (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                <ArrowUp className="h-3 w-3" />
                <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                <MessageSquare className="h-3 w-3" />
                <span>{replies}</span>
            </div>
        </div>
    );
}

export default CommentStats;
