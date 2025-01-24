import axios from 'axios'
import { store } from '../features/store';
import { clearCredentials, setCredentials } from '../features/auth/authSlice';

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
                console.log('response from backend', response)
                const { accessToken } = response.data;

                // Update tokens in Redux store
                store.dispatch(
                    setCredentials({
                        accessToken,
                        role: userRole
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