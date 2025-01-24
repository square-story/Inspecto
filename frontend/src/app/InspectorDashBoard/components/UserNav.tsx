import axiosInstance from "@/api/axios"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
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
import { setInspector } from "@/features/inspector/inspectorSlice"
import { AppDispatch, RootState } from "@/features/store"
import { AxiosError } from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"


export function UserNav() {
    const dispatch = useDispatch<AppDispatch>()
    const inspector = useSelector((state: RootState) => state.inspector)
    const navigate = useNavigate()
    useEffect(() => {
        (async () => {
            try {
                const response = await axiosInstance.get('/inspector/details')
                const freshUser = response.data
                dispatch(setInspector(freshUser))
            } catch (error) {
                if (error instanceof AxiosError) {
                    console.error('Error fetching user data:', error);
                    toast.error(error.message)
                }
            }
        })()
    }, [dispatch])
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
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={inspector.profile_image}
                            alt={`${inspector.firstName} ${inspector.lastName}`}
                            className="object-cover"
                        />
                        <AvatarFallback>{inspector.firstName[0]}{inspector.lastName[0]}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{inspector.firstName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {inspector.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate('/inspector/dashboard/settings')}>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout()}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
