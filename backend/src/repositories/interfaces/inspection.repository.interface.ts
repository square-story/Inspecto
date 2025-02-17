import inspectionModel, { IInspectionDocument, IInspectionInput } from "../../models/inspection.model";
import { IDayAvailability } from "../../models/inspector.model";


export interface IInspectionRepository {
    /**
 * Creates a new inspection document.
 * @param data IInspectionInput data
 * @returns Promise<IInspectionDocument>
 */

    createInspection(inspectionData: IInspectionInput): Promise<IInspectionDocument>;

    /**
     * Updates an existing inspection document.
     * @param id Inspection document id
     * @param data Partial<IInspectionInput> data to update
     * @returns Promise<IInspectionDocument | null>
     */

    updateInspection(id: string, data: Partial<IInspectionInput>): Promise<IInspectionDocument | null>;

    /**
     * Retrieves an inspection by its id.
     * @param id Inspection document id
     * @returns Promise<IInspectionDocument | null>
     */

    getInspectionById(id: string): Promise<IInspectionDocument | null>;

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
}