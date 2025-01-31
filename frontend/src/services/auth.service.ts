import axiosInstance from "@/api/axios";

export const AuthServices = {
    login: async (role: 'inspector' | 'user' | 'admin', credentials: { email: string, password: string }) => {
        const response = await axiosInstance.post(`/${role}/login`, credentials);
        return response.data;
    },
    refreshToken: async (role: 'inspector' | 'user' | 'admin',) => {
        const response = await axiosInstance.post(`/${role}/refresh`)
        return response.data; // { accessToken }
    },
    forgetPassword: async (role: 'inspector' | 'user', credentials: { email: string, role: string }) => {
        const response = await axiosInstance.post(`/${role}/forget`, { email: credentials.email, role: role })
        return response.data
    },
    googleLogin: async (role = 'user', credentials: { token: string }) => {
        const response = await axiosInstance.post(`/${role}/google/callback`, {
            token: credentials.token,
        })
        return response
    },
    passwordReset: async (role: string, credentials: { token: string, email: string, password: string }) => {
        const response = await axiosInstance.post(`/${role}/reset`, { token: credentials.token, email: credentials.email, password: credentials.password })
        return response
    },
    registerUser: async (role: 'user' | 'inspector', data: FormData) => {
        const endpoint = `/${role}/register`;
        const response = await axiosInstance.post(endpoint, data);
        return response.data;
    },
    verifyOTP: async (role: 'user' | 'inspector', credentials: { email: string, otp: string }) => {
        const endpoint = `/${role}/verify-otp`
        const response = await axiosInstance.post(endpoint, { email: credentials.email, otp: credentials.otp })
        return response
    },
    resentOTP: async (role: 'inspector' | 'user', email: string) => {
        return await axiosInstance.post(`/${role}/resend-otp`, { email })
    }
}