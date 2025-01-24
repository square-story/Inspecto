import { AdminModal } from "../models/admin.model";

export class AdminRepository {
    async findByEmail(email: string) {
        return AdminModal.findOne({ email })
    }
    async findById(id: string) {
        return AdminModal.findById(id)
    }
}
