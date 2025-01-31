import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { AlertCompletion } from "../components/AlertCompletion";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/features/auth/authAPI";
import { toast } from "sonner";
import { EmailVerificationAlert } from "../components/EmailVerifcation";

const InspectorNavBar = () => {
    const Inspector = useSelector((state: RootState) => state.inspector);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();


    const handleClose = async () => {
        try {
            await toast.promise(
                dispatch(logoutUser()),
                {
                    loading: 'Logging out...',
                    success: 'Successfully logged out!',
                    error: 'Failed to logout. Please try again.',
                }
            );
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (

        <>
            {!Inspector.isCompleted && (
                <div>
                    <AlertCompletion isOpen onClose={handleClose} />
                </div>
            )}
            {!Inspector.isListed && (
                <EmailVerificationAlert onClose={handleClose} />
            )}
        </>
    );
};

export default InspectorNavBar;