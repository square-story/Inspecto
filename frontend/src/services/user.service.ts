import axiosInstance from "@/api/axios"
import { ProfileFormValues } from "@/app/UserDashboard/profile/ProfileForm"

export type passwordFormSchema = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const userService = {
    getUser: async () => {
        return await axiosInstance.get('/user/details')
    },
    updateUser: async (data: ProfileFormValues) => {
        return await axiosInstance.put('/user/update', data)
    },
    changePassword: async (data: passwordFormSchema) => {
        return await axiosInstance.put('/user/change-password', data)
    }
}