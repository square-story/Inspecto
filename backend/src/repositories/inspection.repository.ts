import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import inspectionModel, { IInspectionDocument, IInspectionInput, InspectionStatus } from "../models/inspection.model";
import { IDayAvailability, } from "../models/inspector.model";
import { IInspectionRepository } from "../core/interfaces/repositories/inspection.repository.interface";
import { ClientSession } from "mongoose";
import { IInspectionStatsFromInspectionDB } from "../core/types/inspection.stats.type";


@injectable()
export class InspectionRepository extends BaseRepository<IInspectionDocument> implements IInspectionRepository {
    constructor() {
        super(inspectionModel);
    }
    async getInspectionStats(inspectorId: string): Promise<IInspectionStatsFromInspectionDB> {
        try {
            const totalInspections = await this.model.countDocuments({
                inspector: inspectorId
            })
            const pendingInspections = await this.model.countDocuments({
                inspector: inspectorId,
                status: InspectionStatus.CONFIRMED
            })
            const completedInspections = await this.model.countDocuments({
                inspector: inspectorId,
                status: InspectionStatus.COMPLETED
            })
            return {
                completedInspections,
                pendingInspections,
                totalInspections
            }
        } catch (error) {
            console.log('The error from stats checking:', error)
            throw error
        }
    }
    async checkSlotAvailability(inspectorId: string, date: Date, slotNumber: number, session: ClientSession): Promise<boolean> {
        const count = await this.model.countDocuments({
            inspector: inspectorId,
            date: date,
            slotNumber: slotNumber,
            status: { $ne: InspectionStatus.CANCELLED }
        }).session(session).exec();
        return count === 0;
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
        return await this.model.find({ user: userId }).populate('vehicle').populate('inspector').populate('inspectionType').sort({ date: -1 });
    }
    async findInspectorInspections(inspectorId: string): Promise<IInspectionDocument[]> {
        return await this.model.find({ inspector: inspectorId, status: InspectionStatus.CONFIRMED }).populate('vehicle').populate('user').populate('inspectionType').sort({ date: -1 });
    }
    async existingInspection(data: { date: Date, inspector: string, slotNumber: number }, session: ClientSession): Promise<IInspectionDocument | null> {
        return await this.model.findOne(data).session(session).exec();
    }
    async createInspection(data: Partial<IInspectionInput>, session: ClientSession): Promise<IInspectionDocument> {
        const inspection = new this.model(data);
        return await inspection.save({ session });
    }
    async updateInspection(id: string, updateData: Partial<IInspectionInput>, session: ClientSession): Promise<IInspectionDocument | null> {
        return await this.model.findByIdAndUpdate(id, updateData, { new: true }).session(session).exec();
    }
}