import { IUsers } from "../models/user.model";
import UserRepository from "../repositories/user.repository";



class UserService {
    private userRepository: UserRepository
    constructor() {
        this.userRepository = new UserRepository()
    }
    async createUser(userData: IUsers) {
        const existingUser = await this.userRepository.findUserByEmail(userData.email)

        if (existingUser) {
            throw new Error('Email already exists')
        }

        return await this.userRepository.createUser(userData);
    }
    async findUsersByEmail(email: string) {
        return await this.userRepository.findUserByEmail(email)
    }
    async updateUser(userId: string, updates: Partial<IUsers>) {
        return await this.userRepository.updateUser(userId, updates)
    }
    async deleteUser(userId: string) {
        return await this.userRepository.deleteUser(userId)
    }
    async getAllUsers() {
        return await this.userRepository.getAllUsers();
    }
}

export default new UserService();