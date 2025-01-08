import { IUsers } from "../models/user.model";
import userRepository from "../repositories/user.repository";

class UserService {
    async createUser(userData: IUsers) {
        const existingUser = await userRepository.findUserByEmail(userData.Email)

        if (existingUser) {
            throw new Error('Email already exists')
        }

        return await userRepository.createUser(userData);
    }
    async findUsersByEmail(email: string) {
        return await userRepository.findUserByEmail(email)
    }
    async updateUser(userId: string, updates: Partial<IUsers>) {
        return await userRepository.updateUser(userId, updates)
    }
    async deleteUser(userId: string) {
        return await userRepository.deleteUser(userId)
    }
    async getAllUsers() {
        return await userRepository.getAllUsers();
    }
}

export default new UserService();