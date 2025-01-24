import { ModeToggle } from "@/components/ui/DarkModeSwitch"
import { Search } from "../components/Search"
import { UserNav } from "../components/UserNav"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/features/store"
import { AlertCompletion } from "../components/AlertCompletion"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "@/features/auth/authAPI"
import { toast } from "sonner"


const InspectorNavBar = () => {
    const Inspector = useSelector((state: RootState) => state.inspector)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    useEffect(() => {
        if (!Inspector.isCompleted) {
            setIsDialogOpen(true);
        }
    }, [Inspector.isCompleted]);

    const handleClose = () => {
        setIsDialogOpen(false);
        toast.promise(
            dispatch(logoutUser()),
            {
                loading: 'Logging out...',
                success: 'Successfully logged out!',
                error: 'Failed to logout. Please try again.',
            }
        )
        navigate('/')
    };
    return (
        <>
            {!Inspector.isCompleted && (
                <div>
                    <AlertCompletion isOpen={isDialogOpen} onClose={handleClose} />
                </div>
            )}
            <div className="flex-row">
                <div className="border-b">
                    <div className="flex h-16 items-center justify-between px-3">
                        <h1 className="font-bold cursor-pointer text-2xl">Inspecto</h1>
                        <div className="ml-auto flex items-center">
                            <Search />
                        </div>
                        <div className="ml-auto flex items-center space-x-4">
                            <ModeToggle />
                            <UserNav />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InspectorNavBar