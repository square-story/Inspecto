import { inject, injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import inspectionModel, { IInspectionDocument, IInspectionInput, InspectionStatus } from "../models/inspection.model";
import { IDayAvailability, WeeklyAvailability, } from "../models/inspector.model";
import { IInspectionRepository } from "../core/interfaces/repositories/inspection.repository.interface";
import { ClientSession, Types } from "mongoose";
import { IInspectionStatsFromInspectionDB } from "../core/types/inspection.stats.type";
import { TYPES } from "../di/types";
import { IInspectorRepository } from "../core/interfaces/repositories/inspector.repository.interface";
import { ServiceError } from "../core/errors/service.error";


@injectable()
export class InspectionRepository extends BaseRepository<IInspectionDocument> implements IInspectionRepository {
  constructor(
    @inject(TYPES.InspectorRepository) private _inspectorRepository: IInspectorRepository
  ) {
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

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new ServiceError('Invalid date format');
    }
    // First check if there's already a booking for this slot
    const existingBooking = await this.model.countDocuments({
      inspector: inspectorId,
      date: {
        $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(parsedDate.setHours(23, 59, 59, 999))
      },
      slotNumber: slotNumber,
      status: { $ne: InspectionStatus.CANCELLED }
    }).session(session).exec();

    if (existingBooking > 0) {
      return false;
    }

    // Then check if the inspector has marked this time slot as unavailable
    const inspector = await this._inspectorRepository.findById(new Types.ObjectId(inspectorId))
    if (!inspector) {
      return false;
    }

    // Get the day of the week
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][parsedDate.getDay()] as keyof WeeklyAvailability;


    // Check if the day is enabled
    if (!inspector.availableSlots[dayOfWeek].enabled) {
      return false;
    }

    // Check if the specific time slot is available
    const timeSlot = inspector.availableSlots[dayOfWeek].timeSlots[slotNumber - 1];
    if (!timeSlot || !timeSlot.isAvailable) {
      return false;
    }

    // Check if the date falls within any unavailability periods
    const isWithinUnavailabilityPeriod = inspector.unavailabilityPeriods.some(period => {
      const periodStart = new Date(period.startDate);
      const periodEnd = new Date(period.endDate);
      return date >= periodStart && date <= periodEnd;
    });

    return !isWithinUnavailabilityPeriod;
  }

  async getAvailableSlots(inspectorId: string, date: Date, dayAvailability: IDayAvailability): Promise<number[]> {
    // Get all bookings for this inspector on this date
    const bookedSlots = await this.model.find({
      inspector: inspectorId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      },
      status: { $nin: [InspectionStatus.CANCELLED] }
    }).select('slotNumber');

    // Create a set of booked slot numbers
    const bookedSlotNumbers = new Set(bookedSlots.map(booking => booking.slotNumber));

    // Filter out the booked slots and only include available time slots
    const availableSlots = dayAvailability.timeSlots
      .map((slot, index) => ({ index: index + 1, isAvailable: slot.isAvailable }))
      .filter(slot => slot.isAvailable && !bookedSlotNumbers.has(slot.index))
      .map(slot => slot.index);

    return availableSlots;
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