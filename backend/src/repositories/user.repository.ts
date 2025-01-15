import { IUsers } from '../models/user.model';
import Users from '../models/user.model';

class UserRepository {
    async createUser(userData: Partial<IUsers>): Promise<IUsers> {
        const user = new Users(userData);
        return await user.save();
    }

    async findById(userId: string): Promise<IUsers | null> {
        return await Users.findById(userId).select('-password');
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
        return await Users.find();
    }
}

export default UserRepository;
