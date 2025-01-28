import { InspectorRepository } from "../repositories/inspector.repository";
import UserRepository from "../repositories/user.repository";

export class AdminService {
    private inspectorRepository: InspectorRepository;
    private userRepository: UserRepository;
    constructor() {
        this.inspectorRepository = new InspectorRepository()
        this.userRepository = new UserRepository();
    }
    async getAllInspectors() {
        return await this.inspectorRepository.getAllInspector()
    }
    async getAllUsers() {
        return await this.userRepository.getAllUsers()
    }
}