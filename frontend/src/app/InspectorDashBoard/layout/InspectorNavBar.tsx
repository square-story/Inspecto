import { ModeToggle } from "@/components/ui/DarkModeSwitch";
import { Search } from "../components/Search";
import { UserNav } from "../components/UserNav";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { AlertCompletion } from "../components/AlertCompletion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/features/auth/authAPI";
import { toast } from "sonner";
import { EmailVerificationAlert } from "../components/EmailVerifcation";
import { ClipLoader } from "react-spinners";

const InspectorNavBar = () => {
    const Inspector = useSelector((state: RootState) => state.inspector);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state for checks

    // Simulate fetching data (replace with actual API call or Redux action)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate an API call or Redux action to fetch Inspector data
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
                setIsLoading(false); // Data fetched, stop loading
            } catch (error) {
                console.error("Failed to fetch Inspector data:", error);
                setIsLoading(false); // Stop loading even if there's an error
            }
        };

        fetchData();
    }, []);

    // Effect to handle profile completion status
    useEffect(() => {
        if (!Inspector.isCompleted) {
            setIsDialogOpen(true);
        }
    }, [Inspector.isCompleted]);

    const handleClose = async () => {
        setIsLoading(true); // Start loading for logout
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
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <>
            {/* Loading Spinner */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <ClipLoader color="#ffffff" size={50} />
                </div>
            )}

            {/* Render content only when not loading */}
            {!isLoading && (
                <>
                    {!Inspector.isCompleted && (
                        <div>
                            <AlertCompletion isOpen={isDialogOpen} onClose={handleClose} />
                        </div>
                    )}
                    {!Inspector.isListed && (
                        <EmailVerificationAlert onClose={handleClose} />
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
            )}
        </>
    );
};

export default InspectorNavBar;