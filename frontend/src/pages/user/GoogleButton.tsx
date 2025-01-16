import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const GoogleButton = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const { credential } = credentialResponse;
            if (!credential) {
                toast.error("Google credential is missing")
                return;
            }

            // Send Google credential to the backend
            const response = await axiosInstance.post(`/user/google/callback`, {
                token: credential,
            });

            if (response?.data?.message) {
                toast.success(response.data.message);
            } else {
                toast.success('Successfully Created Your Account');
            }

            const { accessToken } = response.data;
            dispatch(setCredentials({ accessToken, role: 'user' }));
            navigate('/');
        } catch (error) {
            console.error("Error during Google registration:", error);
            toast.error("Error during Google registration")
        } finally {
            toast.info('completed')
        }
    };

    const handleError = () => {
        console.error("Google authentication failed");

    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={true}
        />
    );
};

export default GoogleButton;
