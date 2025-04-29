import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutUser } from "@/features/auth/authAPI"
import { AppDispatch, } from "@/store"
import { useDispatch, } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useUserDetails } from "@/hooks/useUserDetails"
import { SignedAvatar } from "@/components/SignedAvatar"
import { NotificationBell } from "@/components/NotificationBell"

export function UserProfileIcon() {
    const { user } = useUserDetails();
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();
    const handleNavigation = (path: string) => {
        navigate(path);
    };
    const handleLogout = async () => {
        try {
            toast.promise(
                dispatch(logoutUser()),
                {
                    loading: 'Logging out...',
                    success: 'Successfully logged out!',
                    error: 'Failed to logout. Please try again.',
                }
            )
            navigate('/')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }







    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                    <SignedAvatar
                        publicId={user?.profile_image}
                        fallback={`${user?.firstName || ''} ${user?.lastName || ''}`}
                        className="h-8 w-8"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="flex justify-between items-center">Hey {user.firstName.toUpperCase()}👋<NotificationBell /></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handleNavigation('/user/dashboard')}>
                        Dashboard
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('/user/dashboard/vehicles')}>
                        My Vehicles
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('/user/dashboard/inspection')}>
                        Book an Inspection
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('/user/dashboard/history')}>
                        Transaction History
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Notifications</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/user/dashboard/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
