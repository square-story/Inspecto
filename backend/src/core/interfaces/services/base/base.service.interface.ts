import { Document, FilterQuery, Types } from "mongoose";

export interface IBaseService<T extends Document> {
    create(data: Partial<T>): Promise<T>;
    findById(id: Types.ObjectId): Promise<T | null>;
    findOne(conditions: FilterQuery<T>): Promise<T | null>;
    findAll(): Promise<T[]>;
    find(conditions: FilterQuery<T>): Promise<T[]>;
    update(id: Types.ObjectId, data: Partial<T>): Promise<T | null>;
    delete(id: Types.ObjectId): Promise<T | null>;
}