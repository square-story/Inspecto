import { InspectorRepository } from "../repositories/inspector.repository";

export class InspectorService {
    private inspectorRepository: InspectorRepository;
    constructor() {
        this.inspectorRepository = new InspectorRepository()
    }
    async getInspectorDetails(inspectorId: string) {
        return await this.inspectorRepository.findInspectorById(inspectorId)
    }
}