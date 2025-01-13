import { Button } from "@/components/ui/button"
import { logoutUser } from "@/features/auth/authAPI"
import { AppDispatch } from "@/features/store"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

const UserDashboard = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const handleLogout = async () => {
        await dispatch(logoutUser())
        navigate('/')
    }
    return (
        <div>
            <h1>UserDashboard</h1>
            <Button variant='destructive' onClick={handleLogout}>Logout</Button>
        </div>
    )
}

export default UserDashboard