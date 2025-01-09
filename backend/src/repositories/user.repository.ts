import Users, { IUsers, IUserInput } from '../models/user.model';
import { IUserRepository } from './interfaces/user.repository.interface';


export class UserRepository implements IUserRepository {
    async createUser(userData: IUserInput): Promise<IUsers> {
        const user = new Users(userData);
        return await user.save();
    }
    async findById(userId: string): Promise<IUsers | null> {
        return await Users.findById(userId)
    }
    async findUserByEmail(email: string): Promise<IUsers | null> {
        return await Users.findOne({ Email: email });
    }
    async updateUser(userId: string, updates: Partial<IUsers>): Promise<IUsers | null> {
        return await Users.findByIdAndUpdate(userId, updates, { new: true })
    }
    async deleteUser(userId: string): Promise<IUsers | null> {
        return await Users.findByIdAndDelete(userId);
    }
    async getAllUsers(): Promise<IUsers[]> {
        return await Users.find();
    }
}

