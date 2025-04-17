import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IInspectionTypeDocument, InspectionTypeModel } from "../models/inspection-type.model";
import { IInspectionTypeRepository } from "../core/interfaces/repositories/inspection-type.repository.interface";

@injectable()
export class InspectionTypeRepository extends BaseRepository<IInspectionTypeDocument> implements IInspectionTypeRepository{
    constructor() {
        super(InspectionTypeModel);
    }

    async findActiveTypes(): Promise<IInspectionTypeDocument[]> {
        return await this.model.find({ isActive: true }).sort({ price: 1 }).exec();
    }
}