import { ToasterTrigger } from "@/components/Toaster"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/features/auth/authAPI"
import { AppDispatch } from "@/features/store"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const UserDashboard = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
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
        <div>
            <h1>UserDashboard</h1>
            <Button variant='destructive' onClick={handleLogout}>Logout</Button>
            <ToasterTrigger message="some message" type="error" />
        </div>
    )
}

export default UserDashboard