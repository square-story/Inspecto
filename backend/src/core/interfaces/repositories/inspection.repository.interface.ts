import { ClientSession } from "mongoose";
import { IInspectionDocument, IInspectionInput } from "../../../models/inspection.model";
import { IDayAvailability, TimeSlot } from "../../../models/inspector.model";
import { BaseRepository } from "../../abstracts/base.repository";
import { IInspectionStatsFromInspectionDB } from "../../types/inspection.stats.type";

export interface IInspectionRepository extends BaseRepository<IInspectionDocument> {
    /**
     * Checks if a slot is available for booking.
     * @param inspectorId ObjectId
     * @param date Date
     * @param timeSlot TimeSlot
     * @returns Promise<boolean>
     */
    checkSlotAvailability(inspectorId: string, date: Date, timeSlot: TimeSlot, session: ClientSession): Promise<boolean>;

    /**
     * Retrieves available slots for a given inspector and date.
     * @param inspectorId ObjectId
     * @param date Date
     * @param dayAvailability IDayAvailability
     * @returns Promise<number[]>
     */

    getAvailableSlots(inspectorId: string, date: Date, dayAvailability: IDayAvailability): Promise<TimeSlot[]>;

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
         * @param timeSlot TimeSlot
         * @return Promise<IInspectionDocument | null>
        */

    existingInspection(data: {
        date: Date;
        inspector: string;
        timeSlot: TimeSlot;
    }, session: ClientSession): Promise<IInspectionDocument | null>

    updateInspection(id: string, updateData: Partial<IInspectionInput>, session: ClientSession): Promise<IInspectionDocument | null>;
    createInspection(data: Partial<IInspectionInput>, session: ClientSession): Promise<IInspectionDocument>;
    getInspectionStats(inspectorId: string): Promise<IInspectionStatsFromInspectionDB>;
    getUpcomingInspectionsByUser(userId: string): Promise<IInspectionDocument[]>;
    getCompletedInspectionsByUser(userId: string): Promise<IInspectionDocument[]>;
}