import { inject, injectable } from "inversify";
import { IInspectionTypeDocument, IInspectionTypeInput } from "../models/inspection-type.model";
import { IInspectionTypeService } from "../core/interfaces/services/inspection-type.service.interface";
import { TYPES } from "../di/types";
import { IInspectionTypeRepository } from "../core/interfaces/repositories/inspection-type.repository.interface";
import { ServiceError } from "../core/errors/service.error";
import { Types } from "mongoose";

@injectable()
export class InspectionTypeService implements IInspectionTypeService {
    constructor(
        @inject(TYPES.InspectionTypeRepository) private _inspectionTypeRepository: IInspectionTypeRepository
    ) {
    }

    async createInspectionType(data: IInspectionTypeInput): Promise<IInspectionTypeDocument> {
        try {
            return await this._inspectionTypeRepository.create(data);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error creating inspection type:${error.message}`);
            }
            throw error;
        }
    }

    async updateInspectionType(id: string, data: IInspectionTypeInput): Promise<IInspectionTypeDocument | null> {
        try {
            return await this._inspectionTypeRepository.update(new Types.ObjectId(id), data);
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
            if (error instanceof Error) {
                throw new ServiceError(`Error getting active inspection types: ${error.message}`)
            }
            throw error;
        }
    }

    async toggleInspectionTypeStatus(id: string): Promise<IInspectionTypeDocument | null> {
        try {
            const inspectionType = await this._inspectionTypeRepository.findById(new Types.ObjectId(id));
            if (!inspectionType) {
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

    async getInspectionTypeById(id: Types.ObjectId): Promise<IInspectionTypeDocument | null> {
        try {
            return await this._inspectionTypeRepository.findById(id);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting inspection type by ID: ${error.message}`);
            }
            throw error;
        }
    }

    async deleteInspectionType(id: Types.ObjectId): Promise<IInspectionTypeDocument | null> {
        try {
            return await this._inspectionTypeRepository.delete(id);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error deleting inspection type: ${error.message}`);
            }
            throw error;
        }
    }

    async findAll(): Promise<IInspectionTypeDocument[]> {
        try {
            return await this._inspectionTypeRepository.findAll();
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error finding all inspection types: ${error.message}`);
            }
            throw error;
        }
    }

    async findById(id: Types.ObjectId): Promise<IInspectionTypeDocument | null> {
        try {
            return await this._inspectionTypeRepository.findById(id);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error finding inspection type by ID: ${error.message}`);
            }
            throw error;
        }
    }
}