import { ModeToggle } from "@/components/ui/DarkModeSwitch"
import { MainNav } from "./DashBoardComponents/MainNav"
import { Search } from "./DashBoardComponents/Search"
import { UserNav } from "./DashBoardComponents/UserNav"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/features/store"
import { AlertCompletion } from "./DashBoardComponents/AlertCompletion"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "@/features/auth/authAPI"
import { toast } from "sonner"


const DashBoard = () => {
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
            <div className="md:hidden">
                {/*
                Working of Mobile view
                */}
                <h1 className="text-5xl">Working on it!</h1>
            </div>
            <div className="hidden flex-col md:flex">
                <div className="border-b">
                    <div className="flex h-16 items-center justify-between px-3 space-x-4">
                        <MainNav className="mx-6" />
                        <div className="ml-auto flex items-center space-x-4">
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

export default DashBoard