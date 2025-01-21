import { IInspector } from "../models/inspector.model";
import { InspectorRepository } from "../repositories/inspector.repository";

export class InspectorService {
    private inspectorRepository: InspectorRepository;
    constructor() {
        this.inspectorRepository = new InspectorRepository()
    }
    async getInspectorDetails(inspectorId: string) {
        return await this.inspectorRepository.findInspectorById(inspectorId)
    }
    async completeInspectorProfile(userId: string, data: Partial<IInspector>) {
        const response = await this.inspectorRepository.updateInspector(userId, data)
        if (response) {
            return await this.inspectorRepository.updateInspectorProfileCompletion(userId)
        }
    }
}