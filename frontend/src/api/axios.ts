import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
})

const getRefreshEndpoint = (role: string) => {
    switch (role) {
        case "admin":
            return `${process.env.REACT_APP_API_URL}/admin/refresh`;
        case "user":
            return `${process.env.REACT_APP_API_URL}/user/refresh`;
        case "inspector":
            return `${process.env.REACT_APP_API_URL}/inspector/refresh`;
        default:
            throw new Error("Invalid role for refresh endpoint");
    }
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            const originalRequest = error.config;
            try {
                const userRole = localStorage.getItem("role");
                if (!userRole) {
                    throw new Error('User role not found')
                }

                const refreshEndpoint = getRefreshEndpoint(userRole)
                const refreshResponse = await axios.post(refreshEndpoint, {
                    token: localStorage.getItem("refreshToken"),
                });
                const newAccessToken = refreshResponse.data.accessToken
                localStorage.setItem("accessToken", newAccessToken)
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                console.log('Failed to refresh token:', refreshError)
                localStorage.clear();
                window.location.href = "/login"; // Redirect to login page
                return Promise.reject(refreshError);
            }

        }
        return Promise.reject(error);
    }
)

export default axiosInstance;