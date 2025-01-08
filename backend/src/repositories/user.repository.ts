import Users, { IUsers } from '../models/user.model';
import { IUserRepository } from './interfaces/user.repository.interface';


class UserRepository implements IUserRepository {
    async createUser(userData: IUsers): Promise<IUsers> {
        const user = new Users(userData);
        return await user.save();
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

export default new UserRepository()