import Users from '../models/user.model'

export class UserRepository {
    //Create a New User
    async createUser(userDate: any) {
        const newUser = new Users(userDate)
    }
}