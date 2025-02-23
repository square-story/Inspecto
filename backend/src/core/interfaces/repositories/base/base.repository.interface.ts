import { DeleteResult, Document, FilterQuery, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";

export interface IBaseRepository<T extends Document> {
    /**
     * Retrieves All Documents From In This Collection
     * @return Promise<Document>
    */
    findAll(): Promise<T[]>;

    /**
     * Create a particular Data to this Collection
     * @param data
     * @return Promise<Documents>
    */
    create(data: Partial<T>): Promise<T>;

    /**
     * Update Fields With id into this Documents
     * @param id ObjectId
     * @param data Partial<Document>
     * @return Promise<Document | null>
    */
    update(id: Types.ObjectId, data: Partial<T>): Promise<T | null>;

    /**
     * Delete The Document
     * @param id
     * @return Promise<Document | null>
    */
    delete(id: Types.ObjectId): Promise<T | null>;

    /**
     * Retrieve The Query Details
     * @param filter
     * @return Promise<Document[]>
    */
    find(filter: FilterQuery<T>): Promise<T[]>;

    /**
     * Retrieve the One specific Details
     * @param filter
     * @return Promise<Document | null>
    */
    findOne(filter: FilterQuery<T>): Promise<T | null>;

    /**
     * Find document by ID
     * @param id
     * @return Promise<Document | null>
    */
    findById(id: Types.ObjectId): Promise<T | null>;

    /**
     * Find document by ID and update
     * @param id
     * @param update
     * @return Promise<Document | null>
    */
    findByIdAndUpdate(id: Types.ObjectId, update: UpdateQuery<T>): Promise<T | null>;

    /**
     * Update one document that matches the filter
     * @param filter
     * @param update
     * @return Promise<UpdateWriteOpResult>
    */
    updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateWriteOpResult>;

    /**
     * Delete one document that matches the filter
     * @param filter
     * @return Promise<DeleteResult>
    */
    deleteOne(filter: FilterQuery<T>): Promise<DeleteResult>;

    /**
     * Find one document and update it
     * @param filter
     * @param update
     * @return Promise<Document>
    */
    findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T>;

    /**
     * Add a value to an array field if it doesn't exist
     * @param id
     * @param field
     * @param value
     * @return Promise<Document | null>
    */
    addToSet(id: string, field: string, value: any): Promise<T | null>;

    /**
     * Remove a value from an array field
     * @param id
     * @param field
     * @param value
     * @return Promise<Document | null>
    */
    pull(id: string, field: string, value: any): Promise<T | null>;
}