import { IUsers } from '../../../models/user.model'

export interface IUserRepository {
    findUserByEmail(email: string): Promise<IUsers | null>;
    getAllUsers(): Promise<IUsers[]>;
    updateUserPassword(email: string, password: string): Promise<IUsers | null>;
}