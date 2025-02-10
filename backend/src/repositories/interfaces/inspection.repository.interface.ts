import inspectionModel, { IInspectionDocument, IInspectionInput } from "../../models/inspection.model";


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
}