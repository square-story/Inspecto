import { IUsers } from '../models/user.model';
import Users from '../models/user.model';
import { IUserRepository } from './interfaces/user.repository.interface';

class UserRepository implements IUserRepository {
    async createUser(userData: Partial<IUsers>): Promise<IUsers> {
        const user = new Users(userData);
        return await user.save();
    }

    async findById(userId: string): Promise<IUsers | null> {
        return await Users.findById(userId)
    }

    async findUserByEmail(email: string): Promise<IUsers | null> {
        return await Users.findOne({ email });
    }

    async updateUser(userId: string, updates: Partial<IUsers>): Promise<IUsers | null> {
        return await Users.findByIdAndUpdate(userId, updates, { new: true });
    }

    async deleteUser(userId: string): Promise<IUsers | null> {
        return await Users.findByIdAndDelete(userId);
    }

    async getAllUsers(): Promise<IUsers[]> {
        return await Users.find().select('-password').sort({ createdAt: -1 });
    }
    async updateUserPassword(email: string, password: string): Promise<IUsers | null> {
        return await Users.findOneAndUpdate({ email }, { password }, { new: true })
    }
}

export default UserRepository;
