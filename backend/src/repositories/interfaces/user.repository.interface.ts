import { IUsers } from '../../models/user.model'

export interface IUserRepository {
    createUser(userData: IUsers): Promise<IUsers>;
    findUserByEmail(email: string): Promise<IUsers | null>;
    updateUser(userId: string, updates: Partial<IUsers>): Promise<IUsers | null>;
    deleteUser(userId: string): Promise<IUsers | null>;
    getAllUsers(): Promise<IUsers[]>;
    updateUserPassword(email: string, password: string): Promise<IUsers | null>;
}