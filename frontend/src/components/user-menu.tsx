import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export function UserMenu() {
    const { authUser } = useAuthStore();

    const handleLogout = async () => {
        const success = await useAuthStore.getState().logout();
        if (success) {
            toast.success('Logout successfully');
        } else {
            toast.error('Logout failed');
        }
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-white cursor-pointer">
                    <UserIcon size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 mr-4" align="start">
                <DropdownMenuGroup>
                    <div className="flex items-center gap-2 border-b px-2 mb-1">
                        <Avatar className="h-7 w-7 rounded-lg overflow-hidden">
                            <AvatarImage src="/test-avt.jpg" alt="avt" />
                            <AvatarFallback className="rounded-lg">
                                CN
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <span className="block font-semibold text-gray-800 truncate">
                                {authUser?.username}
                            </span>
                            <span className="block text-sm text-gray-500 truncate">
                                {authUser?.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuGroup>

                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
