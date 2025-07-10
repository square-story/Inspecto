import { Types } from "mongoose";
import { IInspectionTypeDocument, IInspectionTypeInput } from "../../../models/inspection-type.model";

export interface IInspectionTypeService {
    createInspectionType(data: IInspectionTypeInput): Promise<IInspectionTypeDocument>;
    updateInspectionType(id: string, data: Partial<IInspectionTypeInput>): Promise<IInspectionTypeDocument | null>;
    getActiveInspectionTypes(): Promise<IInspectionTypeDocument[]>;
    toggleInspectionTypeStatus(id: string): Promise<IInspectionTypeDocument | null>;
    getInspectionTypeById(id: Types.ObjectId): Promise<IInspectionTypeDocument | null>;
    deleteInspectionType(id: Types.ObjectId): Promise<IInspectionTypeDocument | null>;
    findAll(): Promise<IInspectionTypeDocument[]>;
    findById(id: Types.ObjectId): Promise<IInspectionTypeDocument | null>;
}