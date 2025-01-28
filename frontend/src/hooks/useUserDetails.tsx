import { useState, useEffect } from "react";
import { userService } from "@/services/user.service";
import { setUser } from "@/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // Adjust import based on your store setup

export const useUserDetails = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await userService.getUser();
                dispatch(setUser(response.data));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch user details");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [dispatch]);

    return { user, loading, error };
};
