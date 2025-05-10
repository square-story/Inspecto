import { inject, injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import inspectionModel, { IInspectionDocument, IInspectionInput, InspectionStatus } from "../models/inspection.model";
import { IDayAvailability, TimeSlot, } from "../models/inspector.model";
import { IInspectionRepository } from "../core/interfaces/repositories/inspection.repository.interface";
import { ClientSession } from "mongoose";
import { IInspectionStatsFromInspectionDB } from "../core/types/inspection.stats.type";
import { TYPES } from "../di/types";
import { IInspectorRepository } from "../core/interfaces/repositories/inspector.repository.interface";



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
        inspector: inspectorId,
        status: { $ne: InspectionStatus.CANCELLED }
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
  async checkSlotAvailability(inspectorId: string, date: Date, timeSlot: TimeSlot, session: ClientSession): Promise<boolean> {

    const existingBooking = await this.model.findOne({
      inspector: inspectorId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
      'timeSlot.startTime': timeSlot.startTime,
      'timeSlot.endTime': timeSlot.endTime,
      status: { $ne: InspectionStatus.CANCELLED },
    }).session(session).exec();

    return !existingBooking;
  }

  async getAvailableSlots(inspectorId: string, date: Date, dayAvailability: IDayAvailability): Promise<TimeSlot[]> {
    const existingBookings = await this.model.find({
      inspector: inspectorId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
      status: { $ne: InspectionStatus.CANCELLED },
    }).select('timeSlot');

    // Create a set of booked time slots for quick lookup
    const bookedTimeSlots = new Set(
      existingBookings.map((booking) => `${booking.timeSlot.startTime}-${booking.timeSlot.endTime}`)
    );

    // Filter out time slots that are already booked
    const availableTimeSlots = dayAvailability.timeSlots.filter((slot) => {
      const slotKey = `${slot.startTime}-${slot.endTime}`;
      return slot.isAvailable && !bookedTimeSlots.has(slotKey);
    });

    return availableTimeSlots;
  }
  async findUserInspections(userId: string): Promise<IInspectionDocument[]> {
    return await this.model.find({ user: userId }).populate('vehicle').populate('inspector').populate('inspectionType').sort({ date: -1 });
  }
  async findInspectorInspections(inspectorId: string): Promise<IInspectionDocument[]> {
    return await this.model.find({ inspector: inspectorId, status: InspectionStatus.CONFIRMED }).populate('vehicle').populate('user').populate('inspectionType').sort({ date: -1 });
  }
  async existingInspection(data: { date: Date, inspector: string, timeSlot: TimeSlot }, session: ClientSession): Promise<IInspectionDocument | null> {
    return await this.model.findOne({
      inspector: data.inspector,
      date: data.date,
      'timeSlot.startTime': data.timeSlot.startTime,
      'timeSlot.endTime': data.timeSlot.endTime,
      status: { $ne: InspectionStatus.CANCELLED },
    }).session(session).exec();
  }
  async createInspection(data: Partial<IInspectionInput>, session: ClientSession): Promise<IInspectionDocument> {
    const inspection = new this.model(data);
    return await inspection.save({ session });
  }
  async updateInspection(id: string, updateData: Partial<IInspectionInput>, session: ClientSession): Promise<IInspectionDocument | null> {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true }).session(session).exec();
  }

  async getUpcomingInspectionsByUser(userId: string): Promise<IInspectionDocument[]> {
    return await this.model.find({
      user: userId,
      date: { $gte: new Date() },
      status: { $ne: InspectionStatus.CANCELLED },
    }).populate('vehicle').populate('inspector').populate('inspectionType').sort({ date: 1 });
  }

  async getCompletedInspectionsByUser(userId: string): Promise<IInspectionDocument[]> {
    return await this.model.find({
      user: userId,
      date: { $lt: new Date() },
      status: InspectionStatus.COMPLETED,
    }).populate('vehicle').populate('inspector').populate('inspectionType').sort({ date: -1 });
  }

  async getRecentInspectionsByInspector(inspectorId: string): Promise<IInspectionDocument[]> {
    return await this.model.find({
      inspector: inspectorId,
      date: { $lt: new Date() },
      status: { $ne: InspectionStatus.CANCELLED },
    })
  }
}