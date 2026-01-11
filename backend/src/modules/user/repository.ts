import { injectable } from 'inversify';
import { BaseRepository } from '../../core/abstracts/base.repository';
import Users, { IUsers } from '../../models/user.model';
import { IUserRepository } from '../../core/interfaces/repositories/user.repository.interface';

@injectable()
export class UserRepository extends BaseRepository<IUsers> implements IUserRepository {
    constructor() {
        super(Users);
    }

    async findUserByEmail(email: string): Promise<IUsers | null> {
        return await this.findOne({ email: email });
    }

    async getAllUsers(): Promise<IUsers[]> {
        return await this.findAll()
    }

    async updateUserPassword(email: string, password: string): Promise<IUsers | null> {
        return await this.findOneAndUpdate({ email }, { password });
    }
}


