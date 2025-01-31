import axios from 'axios'
import { store } from '@/store';
import { clearCredentials, setCredentials, setBlockedStatus } from '../features/auth/authSlice';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;
        const isBlocked = !state.auth.status;
        console.log('The blocked state', isBlocked)
        if (isBlocked) {
            const allowedEndpoints = [
                '/support',
                '/contact-admin',
                '/blocked-status',
                '/logout'
            ];
            const isAllowedEndpoint = allowedEndpoints.some(endpoint =>
                config.url?.includes(endpoint)
            );
            if (!isAllowedEndpoint) {
                // Cancel request if endpoint not allowed for blocked users
                return Promise.reject({
                    response: {
                        status: 403,
                        data: {
                            message: 'Account is blocked. Please contact support.'
                        }
                    }
                });
            }
        }
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;


        if (
            error.response?.status === 403 &&
            error.response?.data?.code === 'ACCOUNT_BLOCKED'
        ) {
            store.dispatch(setBlockedStatus({
                status: false,
                blockReason: error.response.data.message
            }));
            window.location.href = '/blocked-account';
            return Promise.reject(error);
        }


        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const state = store.getState();
                const userRole = state.auth.role;

                if (!userRole) {
                    store.dispatch(clearCredentials());
                    return Promise.reject(error);
                }

                // Get refresh token endpoint based on role
                const refreshEndpoint = `/${userRole}/refresh`;

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}${refreshEndpoint}`,
                    {

                    },
                    { withCredentials: true }
                );
                const { accessToken, status, blockReason } = await response.data;
                // Check if user is blocked during token refresh
                if (!status) {
                    store.dispatch(setBlockedStatus({
                        status: false,
                        blockReason
                    }));
                    window.location.href = '/blocked-account';
                    return Promise.reject(error);
                }

                // Update tokens in Redux store
                store.dispatch(
                    setCredentials({
                        accessToken,
                        role: userRole,
                        status
                    })
                );

                // Retry original request with new token
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                store.dispatch(clearCredentials());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;