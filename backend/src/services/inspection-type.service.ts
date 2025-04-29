import { inject, injectable } from "inversify";
import { BaseService } from "../core/abstracts/base.service";
import { IInspectionTypeDocument, IInspectionTypeInput } from "../models/inspection-type.model";
import { IInspectionTypeService } from "../core/interfaces/services/inspection-type.service.interface";
import { TYPES } from "../di/types";
import { IInspectionTypeRepository } from "../core/interfaces/repositories/inspection-type.repository.interface";
import { ServiceError } from "../core/errors/service.error";
import { Types } from "mongoose";

@injectable()
export class InspectionTypeService extends BaseService<IInspectionTypeDocument> implements IInspectionTypeService{
    constructor(
        @inject(TYPES.InspectionTypeRepository) private _inspectionTypeRepository: IInspectionTypeRepository
    ) {
        super(_inspectionTypeRepository);
    }

    async createInspectionType(data: IInspectionTypeInput): Promise<IInspectionTypeDocument> {
        try {
            return await this._inspectionTypeRepository.create(data);
        } catch (error) {
            if(error instanceof Error){
                throw new ServiceError(`Error creating inspection type:${error.message}`);
            }
            throw error;
        }
    }

    async updateInspectionType(id: string, data: IInspectionTypeInput): Promise<IInspectionTypeDocument | null> {
        try {
            return await this._inspectionTypeRepository.update(new Types.ObjectId(id),data);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error updating inspection type: ${error.message}`);
            }
            throw error;
        }
    }

    async getActiveInspectionTypes(): Promise<IInspectionTypeDocument[]> {
        try {
            return await this._inspectionTypeRepository.findActiveTypes();
        } catch (error) {
            if(error instanceof Error){
                throw new ServiceError(`Error getting active inspection types: ${error.message}`)
            }
            throw error;
        }
    }

    async toggleInspectionTypeStatus(id: string): Promise<IInspectionTypeDocument | null> {
        try {
            const inspectionType = await this._inspectionTypeRepository.findById(new Types.ObjectId(id));
            if(!inspectionType){
                throw new ServiceError(`Inspection type with id ${id} not found`);
            }
            return await this._inspectionTypeRepository.update(
                new Types.ObjectId(id), 
                { isActive: !inspectionType.isActive }
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error toggling inspection type status: ${error.message}`);
            }
            throw error;
        }
    }
}