import { ToasterTrigger } from "@/components/Toaster"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/features/auth/authAPI"
import { AppDispatch } from "@/features/store"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import SpotlightCard from '../../components/SpotlightCard';

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
            <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                <i className="fa fa-lock"></i>
                <h2>Enhanced Security</h2>
                <p>Our state of the art software offers peace of mind through the strictest security measures.</p>
                <button>Learn more</button>
            </SpotlightCard>
        </div>
    )
}

export default UserDashboard