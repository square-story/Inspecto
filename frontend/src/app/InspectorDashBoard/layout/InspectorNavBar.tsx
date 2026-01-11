import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { AlertCompletion } from "../components/AlertCompletion";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/features/auth/authAPI";
import { toast } from "sonner";
import { EmailVerificationAlert } from "../components/EmailVerifcation";
import { useInspectorDetails } from "@/hooks/useInspectorDetails";

const InspectorNavBar = () => {
    const { inspector, loading } = useInspectorDetails();
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

    if (loading || !inspector.isLoaded) {
        return null;
    }

    return (

        <>
            {!inspector.isCompleted && (
                <div>
                    <AlertCompletion isOpen onClose={handleClose} />
                </div>
            )}
            {!inspector.isListed && (
                <EmailVerificationAlert onClose={handleClose} />
            )}
        </>
    );
};

export default InspectorNavBar;