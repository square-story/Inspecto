import { InspectorRepository } from "../repositories/inspector.repository";

export class AdminService {
    private inspectorRepository: InspectorRepository;
    constructor() {
        this.inspectorRepository = new InspectorRepository()
    }
    async getAllInspectors() {
        return await this.inspectorRepository.getAllInspector()
    }
}