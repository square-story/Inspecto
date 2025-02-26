import { IInspectionDocument } from "../../../models/inspection.model";
import { IDayAvailability } from "../../../models/inspector.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IInspectionRepository extends BaseRepository<IInspectionDocument> {
    /**
     * Checks if a slot is available for booking.
     * @param inspectorId ObjectId
     * @param date Date
     * @param slotNumber number
     * @returns Promise<boolean>
     */
    checkSlotAvailability(inspectorId: string, date: Date, slotNumber: number): Promise<boolean>;

    /**
     * Retrieves available slots for a given inspector and date.
     * @param inspectorId ObjectId
     * @param date Date
     * @param dayAvailability IDayAvailability
     * @returns Promise<number[]>
     */

    getAvailableSlots(inspectorId: string, date: Date, dayAvailability: IDayAvailability): Promise<number[]>;

    /** 
     * Retrieves User inspection by userId
     * @param userId ObjectId
     * @return Promise<IInspectionDocument | null>
    */
    findUserInspections(userId: string): Promise<IInspectionDocument[]>

    /** 
     * Retrieves inspector inspection by inspectorId
     * @param inspectorId ObjectId
     * @return Promise<IInspectionDocument | null>
    */

    findInspectorInspections(inspectorId: string): Promise<IInspectionDocument[]>

    /** 
         * Retrieves inspection existing state by datas
         * @param date Date
         * @param inspector String
         * @param slotNumber Number
         * @return Promise<IInspectionDocument | null>
        */

    existingInspection(data: {
        date: Date;
        inspector: string;
        slotNumber: number;
    }): Promise<IInspectionDocument | null>;
}