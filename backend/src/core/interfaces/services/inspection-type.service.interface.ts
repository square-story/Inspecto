import { IInspectionTypeDocument, IInspectionTypeInput } from "../../../models/inspection-type.model";
import { IBaseService } from "./base/base.service.interface";

export interface IInspectionTypeService extends IBaseService<IInspectionTypeDocument>{
    createInspectionType(data:IInspectionTypeInput):Promise<IInspectionTypeDocument>;
    updateInspectionType(id:string,data:Partial<IInspectionTypeInput>):Promise<IInspectionTypeDocument | null>;
    getActiveInspectionTypes():Promise<IInspectionTypeDocument[]>;
    toggleInspectionTypeStatus(id:string):Promise<IInspectionTypeDocument | null>;
}