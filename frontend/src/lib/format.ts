export const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor(
        (now.getTime() - postDate.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) {
        return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 10080) {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 43200) {
        const weeks = Math.floor(diffInMinutes / 10080);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 525600) {
        const months = Math.floor(diffInMinutes / 43200);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diffInMinutes / 525600);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
};

export const formatTime = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const timeInMinutes = Math.floor(
        (now.getTime() - postDate.getTime()) / (1000 * 60),
    );
    return timeInMinutes;
};

export const formatOverview = (content: string) => {
    if (content.length <= 100) return content;
    return content.slice(0, 100) + '...';
};
