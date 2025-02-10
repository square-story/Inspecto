import { IInspectionInput, IInspectionDocument } from "../models/inspection.model";
import InspectionRepository from "../repositories/inspection.repository";

class InspectionService {
    private inspectionRepository: InspectionRepository;
    constructor() {
        this.inspectionRepository = new InspectionRepository();
    }
    async createInspection(inspectionData: IInspectionInput): Promise<IInspectionDocument> {
        return await this.inspectionRepository.createInspection(inspectionData);
    }
    async updateInspection(id: string, updateData: Partial<IInspectionInput>): Promise<IInspectionDocument | null> {
        return await this.inspectionRepository.updateInspection(id, updateData);
    }
    async getInspectionById(id: string): Promise<IInspectionDocument | null> {
        return await this.inspectionRepository.getInspectionById(id);
    }
}


export default new InspectionService();