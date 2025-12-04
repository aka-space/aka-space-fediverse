import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/hooks/auth/use-logout';

export function UserMenu() {
    const { authUser } = useAuthStore();
    const { mutate: logout } = useLogout();

    const handleLogout = () => {
        logout();
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage
                        src={authUser?.avatar_path || ''}
                        alt={authUser?.username || 'avatar'}
                        className="w-8 rounded-full shadow-md border-2 border-gray-300"
                    />
                    <AvatarFallback className=" bg-amber-500 text-white font-bold text-sm w-8 h-8 rounded-full border-2 border-gray-300 shadow-md flex items-center justify-center">
                        {authUser?.username
                            ? authUser.username
                                  .split('')
                                  .slice(0, 2)
                                  .map((n: string) => n.toUpperCase())
                                  .join('')
                            : 'NO'}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 mr-4" align="start">
                <DropdownMenuGroup>
                    <div className="flex items-center gap-2 border-b px-2 pb-1 mb-1">
                        <Avatar>
                            <AvatarImage
                                src={authUser?.avatar_path || ''}
                                alt={authUser?.username || 'avatar'}
                                className="w-6 rounded-full shadow-md"
                            />
                            <AvatarFallback className=" bg-amber-500 text-white font-bold text-sm w-6 h-6 rounded-full shadow-md flex items-center justify-center">
                                {authUser?.username
                                    ? authUser.username
                                          .split('')
                                          .slice(0, 2)
                                          .map((n: string) => n.toUpperCase())
                                          .join('')
                                    : 'NO'}
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
