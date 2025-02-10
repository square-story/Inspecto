import inspectionModel, { IInspectionInput, IInspectionDocument } from "../models/inspection.model";
import { IInspectionRepository } from "./interfaces/inspection.repository.interface";

class InspectionRepository implements IInspectionRepository {
    async createInspection(inspectionData: IInspectionInput): Promise<IInspectionDocument> {
        const inspection = new inspectionModel(inspectionData)
        return await inspection.save();
    }
    async updateInspection(id: string, data: Partial<IInspectionInput>): Promise<IInspectionDocument | null> {
        return await inspectionModel.findByIdAndUpdate(id, data, { new: true })
    }
    async getInspectionById(id: string): Promise<IInspectionDocument | null> {
        return await inspectionModel.findById(id);
    }
}

export default InspectionRepository