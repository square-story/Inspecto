import { IInspectionTypeDocument } from "../../../models/inspection-type.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IInspectionTypeRepository extends BaseRepository<IInspectionTypeDocument> {
    findActiveTypes():Promise<IInspectionTypeDocument[]>
}