import axiosInstance from "@/api/axios"

export const userService = {
    getUser: async () => {
        return await axiosInstance.get('/user/details')
    }
}