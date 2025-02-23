import { injectable } from "inversify";
import Inspector, { IInspector } from "../models/inspector.model";
import { BaseRepository } from "../core/abstracts/base.repository";
import mongoose from "mongoose";
import { IInspectorRepository } from "../core/interfaces/repositories/inspector.repository.interface";


@injectable()
export class InspectorRepository extends BaseRepository<IInspector> implements IInspectorRepository {
    constructor() {
        super(Inspector)
    }
    updateInspector(userId: string, updates: Partial<IInspector>): Promise<IInspector | null> {
        return this.model.findByIdAndUpdate(userId, updates, { new: true });
    }
    deleteInspector(userId: string): Promise<IInspector | null> {
        return this.model.findByIdAndDelete(userId);
    }
    getAllInspector(): Promise<IInspector[]> {
        return this.model.find({});
    }
    async findInspectorByEmail(email: string): Promise<IInspector | null> {
        return await this.model.findOne({ email }).exec()
    }
    async updateInspectorPassword(email: string, password: string): Promise<IInspector | null> {
        return await this.findOneAndUpdate({ email }, { password })
    }

    async updateInspectorProfileCompletion(userId: string) {
        return await this.model.findOneAndUpdate({ _id: userId }, { isCompleted: true }, { new: true, runValidators: true }).select('-password')
    }
    async getNearbyInspectors(latitude: string, longitude: string) {
        return await this.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: 10000
                }
            }
        })
    }

    async bookingHandler(inspectorId: string, userId: string, date: Date, session?: mongoose.mongo.ClientSession) {
        try {
            const updateOperation = {
                $push: {
                    bookedSlots: {
                        date: date,
                        slotsBooked: 1,
                        bookedBy: userId
                    }
                }
            };

            const options = {
                new: true,
                ...(session && { session })
            };

            return await this.model.findByIdAndUpdate(
                inspectorId,
                updateOperation,
                options
            );
        } catch (error) {
            console.error('Error in bookingHandler:', error);
            throw error;
        }
    }

    async unbookingHandler(inspectorId: string, userId: string, date: Date, session?: mongoose.mongo.ClientSession) {
        try {
            // Validate inputs
            if (!inspectorId || !userId || !date) {
                throw new Error('Missing required parameters for unbooking');
            }

            // Use the start and end of the day for date matching
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            // First find the document to ensure it exists
            const inspector = await this.model.findById(inspectorId);
            if (!inspector) {
                throw new Error('Inspector not found');
            }

            // Find the specific slot to remove
            const slotToRemove = inspector.bookedSlots.find(slot =>
                slot.bookedBy.toString() === userId &&
                slot.date >= startOfDay &&
                slot.date < endOfDay
            );

            if (!slotToRemove) {
                throw new Error('Booking slot not found');
            }

            // Use $pull with exact match on the slot's _id
            const updateOperation = {
                $pull: {
                    bookedSlots: {
                        _id: slotToRemove._id
                    }
                }
            };

            const options = {
                new: true,
                runValidators: true,
                ...(session && { session })
            };

            const updatedInspector = await this.model.findByIdAndUpdate(
                inspectorId,
                updateOperation,
                options
            );

            if (!updatedInspector) {
                throw new Error('Update failed');
            }

            return updatedInspector;
        } catch (error) {
            console.error('Error in unbookingHandler:', error);
            throw error;
        }
    }
}