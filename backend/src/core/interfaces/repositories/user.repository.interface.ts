import { IUsers } from '../../../models/user.model'

import { BaseRepository } from '../../abstracts/base.repository';


export interface IUserRepository extends BaseRepository<IUsers> {
    findUserByEmail(email: string): Promise<IUsers | null>;
    getAllUsers(): Promise<IUsers[]>;
    updateUserPassword(email: string, password: string): Promise<IUsers | null>;
}