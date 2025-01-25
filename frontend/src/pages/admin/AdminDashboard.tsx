import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/authAPI";


const AdminDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const handleLogout = async () => {
        await dispatch(logoutUser())
        navigate('/')
    }
    return (
        <div>
            <h1>AdminDashboard</h1>
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>

    )
}


export default AdminDashboard