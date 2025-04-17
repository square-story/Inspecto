import { Document, FilterQuery, Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import { IBaseService } from "../interfaces/services/base/base.service.interface";
import { ServiceError } from "../errors/service.error";

export abstract class BaseService<T extends Document> implements IBaseService<T> {
    constructor(protected repository: BaseRepository<T>) { }

    async create(data: Partial<T>): Promise<T> {
        try {
            return await this.repository.create(data);
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('Error creating document')
        }
    }

    async findById(id: Types.ObjectId): Promise<T | null> {
        try {
            return await this.repository.findById(id);
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('Error finding document by ID')
        }
    }

    async findOne(conditions: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.repository.findOne(conditions);
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('Error finding one document')
        }
    }

    async find(conditions: FilterQuery<T>): Promise<T[]> {
        try {
            return await this.repository.find(conditions);
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('Error finding documents')
        }
    }

    async update(id: Types.ObjectId, data: Partial<T>): Promise<T | null> {
        try {
            return await this.repository.update(id, data);
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('Error Updating documents')
        }
    }

    async delete(id: Types.ObjectId): Promise<T | null> {
        try {
            return await this.repository.delete(id);
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('Error Deleting documents')
        }
    }

    async findAll(): Promise<T[]> {
        try {
            return await this.repository.findAll();
        } catch (error) {
            if(error instanceof ServiceError) throw error;
            throw new ServiceError('Error finding all documents')
        }
    }
}