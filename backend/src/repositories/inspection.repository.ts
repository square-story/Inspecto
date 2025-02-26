import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import inspectionModel, { IInspectionDocument, InspectionStatus } from "../models/inspection.model";
import { IDayAvailability, } from "../models/inspector.model";
import { IInspectionRepository } from "../core/interfaces/repositories/inspection.repository.interface";


@injectable()
export class InspectionRepository extends BaseRepository<IInspectionDocument> implements IInspectionRepository {
    constructor() {
        super(inspectionModel);
    }
    async checkSlotAvailability(inspectorId: string, date: Date, slotNumber: number): Promise<boolean> {
        const existingBooking = await this.findOne({ inspector: inspectorId, date, slotNumber, status: { $nin: [InspectionStatus.CANCELLED] } });
        return !existingBooking;
    }

    async getAvailableSlots(inspectorId: string, date: Date, dayAvailability: IDayAvailability): Promise<number[]> {
        const bookedSlots = await this.model.find({
            inspector: inspectorId,
            date: date,
            status: { $nin: [InspectionStatus.CANCELLED] }
        }).select('slotNumber');
        const bookedSlotNumbers = new Set(bookedSlots.map(booking => booking.slotNumber));
        return Array.from({ length: dayAvailability.slots }, (_, i) => i + 1)
            .filter(slot => !bookedSlotNumbers.has(slot));
    }
    async findUserInspections(userId: string): Promise<IInspectionDocument[]> {
        return await this.model.find({ user: userId }).populate('vehicle').populate('inspector').sort({ date: -1 });
    }
    async findInspectorInspections(inspectorId: string): Promise<IInspectionDocument[]> {
        return await this.model.find({ inspector: inspectorId, status: InspectionStatus.CONFIRMED }).populate('vehicle').populate('user').sort({ date: -1 });
    }
    async existingInspection(data: { date: Date, inspector: string, slotNumber: number }): Promise<IInspectionDocument | null> {
        return await this.findOne(data)
    }
}