import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { AuthServices } from "@/services/auth.service";

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
            const response = await AuthServices.googleLogin('user', { token: credential });

            if (response?.data?.message) {
                toast.success(response.data.message);
            } else {
                toast.success('Successfully Created Your Account');
            }

            const { accessToken } = response.data;
            if (!accessToken) {
                toast.error("Access token is missing")
                return;
            }
            dispatch(setCredentials({ accessToken, role: 'user', status: response.data.status }));
            navigate('/');
        } catch (error) {
            console.error("Error during Google registration:", error);
            toast.error("Error during Google registration")
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
