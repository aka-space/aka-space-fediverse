import { BackButton } from '@/components/posts/back-button';
import { CreatePostForm } from '@/components/create-post/create-post-form';
import { Sidebar } from '@/components/sidebar';

export default function Home() {
    return (
        <div className="w-[calc[100%-42rem] flex justify-center">
            <div className="flex flex-col gap-6 max-w-4xl w-full">
                {/* Main Content */}
                <div className="space-y-2">
                    {/* Back Button */}
                    <div>
                        <BackButton />
                    </div>
                    {/* Create post form */}
                    <CreatePostForm />
                </div>
            </div>
            {/* Sidebar */}
            <div className="w-84 fixed top-24 right-0 md:block hidden">
                <Sidebar />
            </div>
        </div>
    );
}
