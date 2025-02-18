import inspectionModel, { IInspectionInput, IInspectionDocument, InspectionStatus } from "../models/inspection.model";
import { IDayAvailability, WeeklyAvailability } from "../models/inspector.model";
import { IInspectionRepository } from "./interfaces/inspection.repository.interface";

class InspectionRepository implements IInspectionRepository {
    async createInspection(inspectionData: Partial<IInspectionInput>): Promise<IInspectionDocument> {
        const inspection = new inspectionModel(inspectionData)
        return await inspection.save();
    }
    async updateInspection(id: string, data: Partial<IInspectionInput>): Promise<IInspectionDocument | null> {
        return await inspectionModel.findByIdAndUpdate(id, data, { new: true })
    }
    async getInspectionById(id: string): Promise<IInspectionDocument | null> {
        return await inspectionModel.findById(id);
    }
    async checkSlotAvailability(inspectorId: string, date: Date, slotNumber: number): Promise<boolean> {
        const existingBooking = await inspectionModel.findOne({ inspector: inspectorId, date, slotNumber, status: { $nin: [InspectionStatus.CANCELLED] } });
        return !existingBooking;
    }

    async getAvailableSlots(inspectorId: string, date: Date, dayAvailability: IDayAvailability): Promise<number[]> {
        const bookedSlots = await inspectionModel.find({
            inspector: inspectorId,
            date: date,
            status: { $nin: [InspectionStatus.CANCELLED] }
        }).select('slotNumber');
        const bookedSlotNumbers = new Set(bookedSlots.map(booking => booking.slotNumber));
        return Array.from({ length: dayAvailability.slots }, (_, i) => i + 1)
            .filter(slot => !bookedSlotNumbers.has(slot));
    }
    async findUserInspections(userId: string): Promise<IInspectionDocument[]> {
        return await inspectionModel.find({ user: userId }).populate('vehicle').populate('inspector').sort({ date: -1 });
    }
    async findInspectorInspections(inspectorId: string): Promise<IInspectionDocument[]> {
        return await inspectionModel.find({ inspector: inspectorId }).populate('vehicle').populate('inspector').sort({ date: -1 });
    }
}

export default InspectionRepository